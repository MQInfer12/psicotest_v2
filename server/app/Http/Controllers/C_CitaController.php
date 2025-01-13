<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_CitaIndexRequest;
use App\Http\Requests\C_CitaRespuestaRequest;
use App\Http\Requests\C_CitaRespuestaStatusRequest;
use App\Http\Requests\C_CitaStoreRequest;
use App\Http\Requests\C_CitaUpdateRequest;
use App\Http\Resources\C_CitaResource;
use App\Http\Resources\U_userResource;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Models\U_user;
use App\Traits\ApiResponse;
use App\Traits\GoogleAPIs;
use Illuminate\Http\Request;

class C_CitaController extends Controller
{
    use ApiResponse;
    use GoogleAPIs;

    //region GETs

    public function index(C_CitaIndexRequest $request)
    {
        $previous = $request->input('previous');
        $email = $request->input('email');

        $user = $request->user();

        $citas = C_Cita::where('fecha', $previous ? '<' : '>=', now()->setTimezone('America/La_Paz')->format('Y-m-d'));

        if ($email) {
            $citas = $citas->where('email_paciente', $email);
        } else {
            $citas = $citas->where('email_psicologo', $user->email);
        }

        $citas = $citas->get();

        $citas = $previous ? $citas->sortByDesc('fecha') : $citas->sortBy('fecha');

        if (!$previous) {
            $access_token = $user->raw_access_token();
            if (!$access_token) {
                return $this->wrongResponse("El token de acceso es requerido.");
            }
            foreach ($citas as $cita) {
                $event = $this->fetchGoogleCalendarEvent($cita->id_calendar, $access_token, $user);
                if ($event === false) {
                    return $this->wrongResponse("Ocurrió un error al obtener las citas.");
                }
                foreach ($event->attendees as $attendee) {
                    if ($attendee->email == $user->email) {
                        $cita->estado = $attendee->responseStatus;
                        break;
                    }
                }
            }
        }

        return $this->successResponse(
            "Citas encontradas correctamente.",
            C_CitaResource::collection($citas)
        );
    }

    public function show(int $id)
    {
        $cita = C_Cita::findOrFail($id);

        if ($cita->email_psicologo != request()->user()->email) {
            return $this->wrongResponse("No tienes permisos para ver esta cita.");
        }

        return $this->successResponse(
            "Cita encontrada correctamente.",
            [
                'cita' => new C_CitaResource($cita),
                'paciente' => new U_userResource($cita->paciente)
            ]
        );
    }

    public function showByPatient(string $email)
    {
        $user = U_user::findOrFail($email);
        return $this->successResponse(
            "Cita encontrada correctamente.",
            C_CitaResource::collection($user->citas_previas)
        );
    }

    public function respuestaStatus(C_CitaRespuestaStatusRequest $request)
    {
        $access_token = $request->user()->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $id_calendar = $request->input('id_calendar');
        $responseStatus = $this->getAttendeeResponseStatus($id_calendar, $access_token, $request->user());

        if ($responseStatus === false) {
            return $this->wrongResponse("Ocurrió un error al obtener el estado de la cita.");
        }

        return $this->successResponse(
            "Citas encontradas correctamente.",
            $responseStatus
        );
    }

    //region POSTs

    public function respuesta(C_CitaRespuestaRequest $request, int $id)
    {
        $cita = C_Cita::findOrFail($id);

        $validatedData = $request->validated();

        $user = $request->user();
        $access_token = $user->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $body = [
            'attendees' => [
                [
                    'email' => $user->email,
                    'responseStatus' => $validatedData['estado']
                ]
            ]
        ];

        $success = $this->updateGoogleCalendarEvent($cita->id_calendar, $body, $access_token, $user);
        if (!$success) {
            return $this->wrongResponse("Ocurrió un error al modificar el estado de la cita o se eliminó el evento del calendario.");
        }

        $cita->estado = $validatedData['estado'];

        return $this->successResponse(
            "Cita actualizada correctamente.",
            new C_CitaResource($cita)
        );
    }

    public function store(C_CitaStoreRequest $request)
    {
        $validatedData = $request->validated();

        $user = $request->user();

        if ($user->cita_proxima) {
            return $this->wrongResponse("Ya tienes una cita próximamente.");
        }

        $horario = C_Horario::findOrFail($validatedData['id_horario']);
        if ($horario->email_user == $user->email) {
            return $this->wrongResponse("No puedes pedir una cita en un horario tuyo.");
        }

        $citasProximas = C_Cita::where('fecha', $validatedData['fecha'])
            ->where('email_psicologo', $horario->email_user)
            ->get();

        foreach ($citasProximas as $cita) {
            $horaInicioCita = strtotime($cita->hora_inicio);
            $horaFinCita = strtotime($cita->hora_final);
            $horaInicioNuevaCita = strtotime($horario->hora_inicio);
            $horaFinNuevaCita = strtotime($horario->hora_final);

            $inicioOverlaping = $horaInicioCita >= $horaInicioNuevaCita && $horaInicioCita < $horaFinNuevaCita;
            $finalOverlaping = $horaFinCita > $horaInicioNuevaCita && $horaFinCita <= $horaFinNuevaCita;
            $insideOverlaping = $inicioOverlaping || $finalOverlaping;
            $outsideOverLaping = $horaInicioCita < $horaInicioNuevaCita && $horaFinCita > $horaFinNuevaCita;

            if ($insideOverlaping || $outsideOverLaping) {
                return $this->wrongResponse("El horario de la cita se solapa con otra cita existente.");
            }
        }

        $access_token = $request->user()->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $latitude = '-17.37516404213628';
        $longitude = '-66.15866852752312';
        $mapsLink = "https://www.google.com/maps/dir/?api=1&destination={$latitude}%2C{$longitude}";

        $psicotestLink = "https://psicotest.cidtec-uc.com/calendar";

        $body = [
            'summary' => 'Cita para el gabinete psicológico',
            'location' => 'Unifranz Cochabamba | Gabinete Psicológico | 1er piso',
            'description' => 'Cita con ' . $horario->user->nombre . ' (psicólogo)' .
                "\n\nEn el gabinete psicológico de Unifranz Cochabamba, subiendo el primer piso por las escaleras a la derecha." .
                "\n<a href='{$mapsLink}'>Ver ubicación</a>" .
                "\n\nGenerado automáticamente por <a href='{$psicotestLink}'>Psicotest</a>",
            'colorId' => '3',
            'start' => [
                'dateTime' => $validatedData['fecha'] . 'T' . $horario->hora_inicio,
                'timeZone' => 'America/La_Paz'
            ],
            'end' => [
                'dateTime' => $validatedData['fecha'] . 'T' . $horario->hora_final,
                'timeZone' => 'America/La_Paz'
            ],
            'attendees' => [
                [
                    'email' => $user->email,
                    'responseStatus' => 'accepted'
                ],
                [
                    'email' => $horario->email_user,
                ]
            ],
            'reminders' => [
                'useDefault' => false,
                'overrides' => [
                    [
                        'method' => 'popup',
                        'minutes' => 60
                    ],
                    [
                        'method' => 'popup',
                        'minutes' => 30
                    ]
                ]
            ]
        ];

        $event = $this->createGoogleCalendarEvent($body, $access_token, $user);
        if (!$event) {
            return $this->wrongResponse("Error al crear la cita.");
        }

        C_Cita::create([
            'id_calendar' => $event->id,
            'html_link_calendar' => $event->htmlLink,
            'email_psicologo' => $horario->email_user,
            'email_paciente' => $user->email,
            'fecha' => $validatedData['fecha'],
            'hora_inicio' => $horario->hora_inicio,
            'hora_final' => $horario->hora_final,
        ]);

        $user->refresh();

        return $this->successResponse(
            "Cita creada correctamente.",
            new U_userResource($user)
        );
    }

    //region PUTs

    public function update(C_CitaUpdateRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $cita = C_Cita::findOrFail($id);

        if ($cita->email_psicologo != request()->user()->email) {
            return $this->wrongResponse("No tienes permisos para actualizar esta cita.");
        }

        $cita->update($validatedData);

        return $this->successResponse(
            "Cita actualizada correctamente.",
            new C_CitaResource($cita)
        );
    }

    public function destroyWithToken(Request $request, int $id)
    {
        $cita = C_Cita::findOrFail($id);

        $user = $request->user();
        $access_token = $user->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $this->deleteGoogleCalendarEvent($cita->id_calendar, $access_token, $user);

        $cita->delete();

        return $this->successResponse(
            "Cita cancelada correctamente.",
            new U_userResource($request->user())
        );
    }
}
