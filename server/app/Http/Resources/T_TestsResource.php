<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class T_TestsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre_test' => $this->nombre,
            'nombre_autor' => $this->autor,
            'nombre_autor_creador' => $this->autor_creador ? $this->autor_creador->nombre : null,
            'canvas' => $this->canvas,
        ];
    }
}
