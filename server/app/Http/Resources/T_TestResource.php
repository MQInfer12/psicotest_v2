<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class T_TestResource extends JsonResource
{
    public function toArray($request)
    {
        //? AL MODIFICAR ESTA RESPUESTA AÑADIR LOS MISMOS CAMPOS A T_Test_RespuestaResource.php
        return [
            'id' => $this->id,
            'nombre_test' => $this->nombre,
            'nombre_autor' => $this->autor,
            'nombre_autor_creador' => $this->autor_creador ? $this->autor_creador->nombre : null,
            'canvas' => $this->canvas,
            'version' => $this->latest_version->version,
            'test' => $this->latest_version->test,
            'resultados' => null
        ];
    }
}
