<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class C_CitaSimpleResource extends JsonResource
{
    public function toArray($request)
    {
        $data = parent::toArray($request);
        unset(
            $data['cita_proxima'],
            $data['cita_anterior']
        );
        return $data;
    }
}
