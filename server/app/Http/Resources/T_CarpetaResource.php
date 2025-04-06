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
            'id_grupo' => $this->id_grupo,
            'descripcion_grupo' => $this->grupo?->descripcion,
            'global' => $this->global,
        ];
    }
}
