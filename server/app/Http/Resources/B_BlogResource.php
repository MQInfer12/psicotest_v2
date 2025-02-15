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
            'evento_nombre' => $this->evento_nombre,
            'evento_fecha' => date('c', strtotime($this->evento_fecha . ' -4 hours')),
            'evento_latitud' => $this->evento_latitud,
            'evento_longitud' => $this->evento_longitud,
            'evento_id_calendar' => $this->evento_id_calendar,
            'evento_link_calendar' => $this->evento_link_calendar,
            'yo_atiendo' => $this->yo_atiendo ?? false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
