<?php

namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class T_Tests_RepuestaResource extends JsonResource
{
    public function toArray($request)
    {
        //? AL MODIFICAR ESTA RESPUESTA AÑADIR LOS MISMOS CAMPOS A T_TestsResource.php
        $test = $this->test_version->test_entity;
        return [
            'id' => $test->id,
            'id_respuesta' => $this->id,
            'nombre_asignador' => $this->asignador->nombre,
            'nombre_test' => $test->nombre,
            'nombre_autor' => $test->autor,
            'nombre_autor_creador' => $test->autor_creador ? $test->autor_creador->nombre : null,
            'canvas' => $test->canvas,
            'estado' => $this->estado
        ];
    }
}