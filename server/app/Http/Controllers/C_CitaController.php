<?php

namespace App\Http\Controllers;

use App\Constants\Permisos;
use App\Http\Requests\C_CitaIndexRequest;
use App\Http\Requests\C_CitaRespuestaRequest;
use App\Http\Requests\C_CitaRespuestaStatusRequest;
use App\Http\Requests\C_CitaStoreRequest;
use App\Http\Requests\C_CitaUpdateRequest;
use App\Http\Resources\C_CitaResource;
use App\Http\Resources\U_userResource;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Models\C_Ocupacion;
use App\Models\R_Contador;
use App\Models\U_Rol;
use App\Models\U_user;
use App\Traits\ApiResponse;
use App\Traits\GoogleAPIs;
use App\Traits\GoogleCalendarTrait;
use App\Traits\PermisosTrait;
use App\Traits\TimeTrait;
use Illuminate\Http\Request;

class C_CitaController extends Controller
{
    use ApiResponse;
    use GoogleAPIs;
    use GoogleCalendarTrait;
    use TimeTrait;
    use PermisosTrait;

    //region GETs

    public function index(C_CitaIndexRequest $request)
    {
        $previous = $request->input('previous');
        $email = $request->input('email');

        $user = $request->user();

        $citas = C_Cita::where('fecha', $previous ? '<' : '>=', $this->get_now_local()->format('Y-m-d'));

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
                /* if ($event === false) {
                    return $this->wrongResponse("Ocurrió un error al obtener las citas.");
                } */
                if ($event) {
                    foreach ($event->attendees as $attendee) {
                        if ($attendee->email == $user->email) {
                            $cita->estado = $attendee->responseStatus;
                            break;
                        }
                    }
                } else {
                    $cita->estado = 'needsAction';
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

        $me = request()->user();

        $puede_ver_todas = $this->tienePermiso($me, Permisos::ADMINISTRAR_PACIENTES);

        if ($cita->email_psicologo != $me->email && !$puede_ver_todas) {
            $citas = C_Cita::where('email_paciente', $cita->email_paciente)
                ->where('email_psicologo', $me->email)
                ->get();
            if ($citas->isEmpty()) {
                return $this->wrongResponse("No tienes permisos para ver esto.");
            }
        }

        if ($puede_ver_todas && $cita->fecha >= $this->get_now_local()->format('Y-m-d')) {
            return $this->wrongResponse("No tienes permisos para ver esto.");
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

        $emailPaciente = $validatedData['email_paciente'] ?? null;
        $nombrePaciente = $validatedData['nombre_paciente'] ?? null;
        $anonimo = $validatedData['anonimo'] ?? false;

        $nuevoPaciente = null;
        if ($nombrePaciente) {
            $randomness = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyz', 8)), 0, 8);
            $nuevoEmail = strtolower(str_replace(' ', '_', $nombrePaciente)) . "_" . $randomness . "@neurall.com";
            $rolPorDefecto = U_Rol::where('por_defecto', true)->first();
            if (!$rolPorDefecto) {
                return $this->wrongResponse("No se encontró un rol por defecto.");
            }
            $nuevoPaciente = U_user::create([
                "email" => $nuevoEmail,
                "nombre" => $nombrePaciente,
                "id_rol" => $rolPorDefecto->id,
            ]);
        }

        $paciente = $nuevoPaciente ?? ($emailPaciente ? U_user::findOrFail($emailPaciente) : $request->user());

        if (!$emailPaciente && $paciente->cita_proxima) {
            return $this->wrongResponse("Ya tienes una cita próximamente.");
        }

        $horario = C_Horario::findOrFail($validatedData['id_horario']);
        if ($horario->email_user == $paciente->email) {
            return $this->wrongResponse("No puedes pedir una cita en un horario tuyo.");
        }

        $citasProximas = C_Cita::where('fecha', $validatedData['fecha'])
            ->where('email_psicologo', $horario->email_user)
            ->get();

        foreach ($citasProximas as $cita) {
            if ($this->check_overlaping_hour(
                $cita->hora_inicio,
                $cita->hora_final,
                $horario->hora_inicio,
                $horario->hora_final
            )) {
                return $this->wrongResponse("El horario de la cita se solapa con otra cita existente.");
            }
        }

        $ocupacionesProximas = C_Ocupacion::where('fecha', $validatedData['fecha'])
            ->where('email_user', $horario->email_user)
            ->get();

        foreach ($ocupacionesProximas as $ocupacion) {
            if ($this->check_overlaping_hour(
                $ocupacion->hora_inicio,
                $ocupacion->hora_final,
                $horario->hora_inicio,
                $horario->hora_final
            )) {
                return $this->wrongResponse("El horario de la cita se solapa con una ocupación existente.");
            }
        }

        $creador_evento = $request->user();
        $access_token = $creador_evento->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $email_invitado = $emailPaciente ? $paciente->email : $horario->email_user;
        $body = $this->create_calendar_body(
            $horario->user->nombre,
            $validatedData['fecha'],
            $horario->hora_inicio,
            $horario->hora_final,
            $creador_evento->email,
            $email_invitado,
            $anonimo
        );

        $event = $this->createGoogleCalendarEvent($body, $access_token, $creador_evento);
        if (!$event) {
            return $this->wrongResponse("Error al crear la cita.");
        }

        $cita = C_Cita::create([
            'id_calendar' => $event->id,
            'html_link_calendar' => $event->htmlLink,
            'creador_calendar' => $creador_evento->email,
            'email_psicologo' => $horario->email_user,
            'email_paciente' => $paciente->email,
            'fecha' => $validatedData['fecha'],
            'hora_inicio' => $horario->hora_inicio,
            'hora_final' => $horario->hora_final,
        ]);

        $paciente->refresh();

        return $this->successResponse(
            "Cita creada correctamente.",
            [
                "paciente" => new U_userResource($paciente),
                "cita" => new C_CitaResource($cita)
            ]
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

        $user_creador = U_user::find($cita->creador_calendar);
        if ($user_creador) {
            $access_token_creador = $user_creador->raw_access_token();
            if (!$access_token_creador) {
                $this->deleteGoogleCalendarEvent($cita->id_calendar, $access_token_creador, $user_creador);
            } else {
                $me = $request->user();
                $this->deleteGoogleCalendarEvent($cita->id_calendar, $me->raw_access_token(), $me);
            }
        }

        $cita->delete();

        $contador = R_Contador::firstOrFail();
        $contador->citas_canceladas += 1;
        $contador->save();

        return $this->successResponse(
            "Cita cancelada correctamente.",
            new U_userResource($request->user())
        );
    }
}
