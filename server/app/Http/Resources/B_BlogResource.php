<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class B_BlogResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'descripcion' => $this->descripcion,
            'portada' => $this->portada,
            'autor' => new U_userResource($this->autor),
            'destacado' => $this->destacado,
            'config' => json_decode($this->config),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
