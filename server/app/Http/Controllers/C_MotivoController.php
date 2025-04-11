<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_MotivoCancelacionRequest;
use App\Http\Requests\C_MotivoReprogramacionRequest;
use App\Http\Resources\C_CitaResource;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Models\C_Motivo;
use App\Models\C_Ocupacion;
use App\Models\R_Contador;
use App\Models\U_user;
use App\Traits\ApiResponse;
use App\Traits\GoogleAPIs;
use App\Traits\GoogleCalendarTrait;
use App\Traits\TimeTrait;

class C_MotivoController extends Controller
{
    use ApiResponse;
    use GoogleAPIs;
    use GoogleCalendarTrait;
    use TimeTrait;

    public function reprogramacion(C_MotivoReprogramacionRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $cita = C_Cita::findOrFail($id);
        $horario = C_Horario::findOrFail($validatedData['id_horario']);

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

        $paciente = $cita->paciente;
        $psicologo = $cita->psicologo;

        $new_id_calendar = $cita->id_calendar;
        $new_html_link_calendar = $cita->html_link_calendar;

        $access_token_psicologo = $psicologo->raw_access_token();
        //? crear un nuevo evento en el calendario con la nueva fecha y hora
        if ($access_token_psicologo) {
            $body = $this->create_calendar_body(
                $psicologo->nombre,
                $validatedData['fecha'],
                $horario->hora_inicio,
                $horario->hora_final,
                $psicologo->email,
                $paciente->email
            );

            $event = $this->createGoogleCalendarEvent($body, $access_token_psicologo, $psicologo);
            if (!$event) {
                return $this->wrongResponse("Error al reprogramar la cita.");
            }

            $new_id_calendar = $event->id;
            $new_html_link_calendar = $event->htmlLink;
        }

        $creador = U_user::find($cita->creador_calendar);
        if ($creador) {
            $access_token_creador = $creador->raw_access_token();
            //? si casualmente tengo el token del creador entonces borrar el evento del calendario anterior
            if ($access_token_creador) {
                $this->deleteGoogleCalendarEvent($cita->id_calendar, $access_token_creador, $creador);
            } else {
                $me = $request->user();
                $this->deleteGoogleCalendarEvent($cita->id_calendar, $me->raw_access_token(), $me);
            }
        }

        C_Motivo::create([
            'id_cita' => $cita->id,
            'descripcion' => $validatedData['descripcion'],
            'tipo' => 'reprogramacion',
            'email_psicologo' => $psicologo->email,
            'email_paciente' => $paciente->email,
            'fecha_anterior' => $cita->fecha,
            'hora_inicio_anterior' => $cita->hora_inicio,
            'hora_final_anterior' => $cita->hora_final,
            'fecha_nueva' => $validatedData['fecha'],
            'hora_inicio_nueva' => $horario->hora_inicio,
            'hora_final_nueva' => $horario->hora_final,
        ]);

        $cita->update([
            'id_calendar' => $new_id_calendar,
            'html_link_calendar' => $new_html_link_calendar,
            'creador_calendar' => $psicologo->email,
            'fecha' => $validatedData['fecha'],
            'hora_inicio' => $horario->hora_inicio,
            'hora_final' => $horario->hora_final,
        ]);

        return $this->successResponse("Cita reprogramada correctamente", new C_CitaResource($cita));
    }

    public function cancelacion(C_MotivoCancelacionRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $cita = C_Cita::findOrFail($id);

        $user = U_user::find($cita->creador_calendar);
        $access_token = $user?->raw_access_token();
        if ($access_token) {
            $this->deleteGoogleCalendarEvent($cita->id_calendar, $access_token, $user);
        } else {
            $me = $request->user();
            $this->deleteGoogleCalendarEvent($cita->id_calendar, $me->raw_access_token(), $me);
        }

        C_Motivo::create([
            'descripcion' => $validatedData['descripcion'],
            'tipo' => 'cancelacion',
            'email_psicologo' => $cita->psicologo->email,
            'email_paciente' => $cita->paciente->email,
            'id_cita' => $cita->id,
            'fecha_anterior' => $cita->fecha,
            'hora_inicio_anterior' => $cita->hora_inicio,
            'hora_final_anterior' => $cita->hora_final,
        ]);

        $cita->delete();

        $contador = R_Contador::firstOrFail();
        $contador->citas_canceladas += 1;
        $contador->save();

        return $this->successResponse(
            "Cita cancelada correctamente.",
            null
        );
    }
}
