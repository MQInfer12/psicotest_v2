<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class T_Test_RespuestaResource extends JsonResource
{
    public function toArray($request)
    {
        //? AL MODIFICAR ESTA RESPUESTA AÑADIR LOS MISMOS CAMPOS A T_TestResource.php
        $version = $this->test_version;
        $test = $this->test_version->test_entity;
        return [
            'id' => $test->id,
            'id_respuesta' => $this->id,
            'nombre_test' => $test->nombre,
            'nombre_autor' => $test->autor,
            'nombre_autor_creador' => $test->autor_creador?->nombre,
            'canvas' => $test->canvas,
            'version' => $version->version,
            'test' => $version->test,
            'resultados' => $this->resultados,
            'user' => new U_userResource($this->user),
            'fecha_enviado' => $this->fecha_enviado,
            'interpretacion' => $this->interpretacion,
            'nombre_carpeta' => $this->carpeta?->descripcion
        ];
    }
}
