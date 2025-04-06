<?php

namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class T_GrupoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'descripcion' => $this->descripcion,
        ];
    }
}
