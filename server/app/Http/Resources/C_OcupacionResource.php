<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class C_OcupacionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email_user' => $this->email_user,
            'descripcion' => $this->descripcion,
            'fecha' => $this->fecha,
            'hora_inicio' => $this->hora_inicio,
            'hora_final' => $this->hora_final,
            'citas_colindantes_count' => count($this->citas_colindantes()),
        ];
    }
}
