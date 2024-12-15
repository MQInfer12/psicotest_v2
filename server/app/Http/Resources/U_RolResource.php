<?php

namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class U_RolResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'descripcion' => $this->descripcion,
            'por_defecto' => $this->por_defecto,
            'permisos' => $this->permisos
        ];
    }
}
