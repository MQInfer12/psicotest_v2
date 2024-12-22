<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class C_CitaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email_psicologo' => $this->email_psicologo,
            'nombre_psicologo' => $this->psicologo->nombre,
            'email_paciente' => $this->email_paciente,
            'fecha' => $this->fecha,
            'hora_inicio' => $this->hora_inicio,
            'hora_final' => $this->hora_final,
        ];
    }
}
