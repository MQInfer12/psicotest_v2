<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class T_TestsResource extends JsonResource
{
    public function toArray($request)
    {
        //? AL MODIFICAR ESTA RESPUESTA AÑADIR LOS MISMOS CAMPOS A T_Tests_RespuestasResource.php
        return [
            'id' => $this->id,
            'id_respuesta' => null,
            'nombre_asignador' => null,
            'nombre_test' => $this->nombre,
            'nombre_autor' => $this->autor,
            'nombre_autor_creador' => $this->autor_creador ? $this->autor_creador->nombre : null,
            'canvas' => $this->canvas,
            'estado' => null,
        ];
    }
}
