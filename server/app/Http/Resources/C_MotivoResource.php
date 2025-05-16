<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class C_MotivoResource extends JsonResource
{

    public function toArray($request)
    {
        $psicologo = $this->psicologo;
        $paciente = $this->paciente;
        $cancelador = $this->cancelador;

        return [
            'id' => $this->id,
            'id_cita' => $this->id_cita,
            'descripcion' => $this->descripcion,
            'email_psicologo' => $psicologo->email,
            'nombre_psicologo' => $psicologo->nombre,
            'foto_psicologo' => $psicologo->foto,
            'email_paciente' => $paciente->email,
            'nombre_paciente' => $paciente->nombre,
            'foto_paciente' => $paciente->foto,
            'email_cancelador' => $cancelador->email,
            'nombre_cancelador' => $cancelador->nombre,
            'foto_cancelador' => $cancelador->foto,
            'fecha_anterior' => $this->fecha_anterior,
            'hora_inicio_anterior' => $this->hora_inicio_anterior,
            'hora_final_anterior' => $this->hora_final_anterior,
            'fecha_nueva' => $this->fecha_nueva,
            'hora_inicio_nueva' => $this->hora_inicio_nueva,
            'hora_final_nueva' => $this->hora_final_nueva,
            'created_at' => $this->created_at,
        ];
    }
}
