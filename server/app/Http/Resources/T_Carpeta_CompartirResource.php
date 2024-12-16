<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class T_Carpeta_CompartirResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email_user' => $this->email_user,
            'id_carpeta' => $this->id_carpeta,
        ];
    }
}
