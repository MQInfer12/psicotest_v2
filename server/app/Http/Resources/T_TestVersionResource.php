<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class T_TestVersionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'id_test' => $this->id_test,
            'version' => $this->version,
            'fecha' => $this->fecha,
        ];
    }
}
