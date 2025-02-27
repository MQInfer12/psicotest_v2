<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class T_CarpetaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'descripcion' => $this->descripcion,
            'email_user' => $this->email_user,
            'tipo' => $this->tipo,
            'global' => $this->global,
        ];
    }
}
