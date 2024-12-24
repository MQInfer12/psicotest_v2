<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_CitaDestroyRequest;
use App\Http\Requests\C_CitaStoreRequest;
use App\Http\Resources\C_CitaResource;
use App\Http\Resources\U_userResource;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class C_CitaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $citas = C_Cita::where('email_psicologo', $request->user()->email)->get();
        return $this->successResponse(
            "Citas encontradas correctamente.",
            C_CitaResource::collection($citas)
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

        $access_token = $validatedData['access_token'];
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $body = [
            'summary' => 'Cita para el gabinete psicológico',
            'location' => 'Unifranz Cochabamba - Gabinete Psicológico - 1er piso',
            'description' => 'Cita con el psicólogo ' . $horario->user->nombre . ' - Generado automáticamente por Psicotest',
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
            ]
        ];

        $client = new Client();
        try {
            $response = $client->post('https://www.googleapis.com/calendar/v3/calendars/primary/events', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $access_token,
                    'Content-Type' => 'application/json',
                ],
                'json' => $body,
            ]);
            $event = json_decode($response->getBody()->getContents());

            C_Cita::create([
                'id_calendar' => $event->id,
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
        } catch (RequestException $e) {
            return $this->wrongResponse("Error al crear la cita.");
        }
    }

    public function destroyWithToken(C_CitaDestroyRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $cita = C_Cita::findOrFail($id);

        $access_token = $validatedData['access_token'];
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $client = new Client();
        try {
            $client->delete('https://www.googleapis.com/calendar/v3/calendars/primary/events/' . $cita->id_calendar, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $access_token,
                    'Content-Type' => 'application/json',
                ],
            ]);
        } catch (RequestException $e) {
        }

        $cita->delete();
        return $this->successResponse(
            "Cita cancelada correctamente.",
            new U_userResource($request->user())
        );
    }
}
