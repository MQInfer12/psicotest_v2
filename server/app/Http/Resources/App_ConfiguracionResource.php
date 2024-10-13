<?php

namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class App_ConfiguracionResource extends JsonResource
{
    public function toArray($request)
    {
        return json_decode($this->configuraciones);
    }
}
