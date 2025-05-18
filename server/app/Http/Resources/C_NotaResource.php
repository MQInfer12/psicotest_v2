<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class C_NotaResource extends JsonResource
{
    public function toArray($request)
    {
        $psicologo = $this->psicologo;
        $paciente = $this->paciente();
        return [
            'id' => $this->id,
            'id_cita' => $this->id_cita,
            'id_caso' => $this->id_caso,
            'descripcion' => $this->descripcion,
            'email_psicologo' => $psicologo->email,
            'nombre_psicologo' => $psicologo->nombre,
            'foto_psicologo' => $psicologo->foto,
            'email_paciente' => $paciente->email,
            'nombre_paciente' => $paciente->nombre,
            'foto_paciente' => $paciente->foto,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
