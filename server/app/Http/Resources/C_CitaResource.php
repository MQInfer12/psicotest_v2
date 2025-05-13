<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class C_CitaResource extends JsonResource
{
    public function toArray($request)
    {
        $paciente = $this->caso->paciente;

        $cita_proxima = $this->cita_proxima();
        $cita_anterior = $this->cita_anterior();

        return [
            'id' => $this->id,
            'id_caso' => $this->id_caso,
            'id_calendar' => $this->id_calendar,
            'html_link_calendar' => $this->html_link_calendar,

            'email_psicologo' => $this->email_psicologo,
            'nombre_psicologo' => $this->psicologo->nombre,
            'foto_psicologo' => $this->psicologo->foto,

            'email_paciente' => $paciente->email,
            'nombre_paciente' => $paciente->nombre,
            'foto_paciente' => $paciente->foto,

            'fecha' => $this->fecha,
            'hora_inicio' => $this->hora_inicio,
            'hora_final' => $this->hora_final,

            'fecha_cierre_clinico' => $this->fecha_cierre_clinico,

            'id_motivo_consulta' => $this->id_motivo_consulta,
            'descripcion_motivo_consulta' => $this->motivo_consulta?->descripcion,

            'metodo' => $this->metodo,
            'metodo_inicial' => $this->metodo_inicial,
            'motivo' => $this->motivo,
            'antecedentes' => $this->antecedentes,
            'observaciones' => $this->observaciones,

            'cita_proxima' => $cita_proxima ? new C_CitaSimpleResource($cita_proxima) : null,
            'cita_anterior' => $cita_anterior ? new C_CitaSimpleResource($cita_anterior) : null,
        ];
    }
}
