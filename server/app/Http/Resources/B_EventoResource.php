<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class B_EventoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'fecha' => date('c', strtotime($this->fecha . ' -4 hours')),
            'latitud' => $this->latitud,
            'longitud' => $this->longitud,
            'direccion' => $this->direccion,
        ];
    }
}
