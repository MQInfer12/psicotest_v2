<?php

namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class U_userResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'email' => $this->email,
            'nombre' => $this->nombre,
            'foto' => $this->foto,
            'genero' => $this->genero,
            'fecha_nacimiento' => $this->fecha_nacimiento,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
