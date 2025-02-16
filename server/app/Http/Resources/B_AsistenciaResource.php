<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class B_AsistenciaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email_user' => $this->user->email,
            'nombre_user' => $this->user->nombre,
            'foto_user' => $this->user->foto,
            'link_calendar' => $this->link_calendar,
        ];
    }
}
