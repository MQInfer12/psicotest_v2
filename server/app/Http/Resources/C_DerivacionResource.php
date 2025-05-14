<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class C_DerivacionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'id_caso' => $this->id_caso,
            'derivado_a' => $this->derivado_a,
            'resumen' => $this->resumen,
        ];
    }
}
