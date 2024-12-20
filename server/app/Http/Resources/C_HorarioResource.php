<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class C_HorarioResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email_user' => $this->email_user,
            'dia' => $this->dia,
            'hora_inicio' => $this->hora_inicio,
            'hora_final' => $this->hora_final,
        ];
    }
}
