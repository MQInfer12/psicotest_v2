<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class C_CasoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email_paciente' => $this->email_paciente,
            'nombre' => $this->nombre,
            'motivo_cierre' => $this->motivo_cierre,
            'fecha_cierre' => $this->fecha_cierre,
            'derivacion' => new C_DerivacionResource($this->derivacion),
        ];
    }
}
