<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IA_PlantillaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'plantilla' => json_decode($this->plantilla),
            'id_tests' => $this->tests->pluck('id', 'nombre')->toArray(),
        ];
    }
}
