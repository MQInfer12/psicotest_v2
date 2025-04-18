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
            'nombre_user' => $this->user->nombre,
            'fecha_nacimiento_user' => $this->user->fecha_nacimiento,
            'email_user' => $this->user->email,
            'foto_user' => $this->user->foto,
            'nombre_test' => $test->nombre,
            'id_carpeta' => $this->carpeta?->id,
            'nombre_carpeta' => $this->carpeta?->descripcion,
            'nombre_autor' => $test->autor,
            'nombre_autor_creador' => $test->autor_creador?->nombre,
            'canvas' => $test->canvas,
            'estado' => $this->estado,
            'tiene_interpretacion' => !!$this->interpretacion,
            'fecha_asignado' => $this->fecha_asignado,
            'fecha_enviado' => $this->fecha_enviado,
            'fecha_visible' => $this->fecha_visible
        ];
    }
}
