<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class C_CitaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'id_calendar' => $this->id_calendar,
            'html_link_calendar' => $this->html_link_calendar,
            'email_psicologo' => $this->email_psicologo,
            'nombre_psicologo' => $this->psicologo->nombre,
            'foto_psicologo' => $this->psicologo->foto,
            'email_paciente' => $this->email_paciente,
            'nombre_paciente' => $this->paciente->nombre,
            'foto_paciente' => $this->paciente->foto,
            'fecha' => $this->fecha,
            'hora_inicio' => $this->hora_inicio,
            'hora_final' => $this->hora_final,
            'estado' => $this->estado,
        ];
    }
}
