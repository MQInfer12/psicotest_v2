<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class T_TestsResource extends JsonResource
{
    public function toArray($request)
    {
        $userEmail = $request->user()->email;
        //? AL MODIFICAR ESTA RESPUESTA AÑADIR LOS MISMOS CAMPOS A T_Tests_RespuestasResource.php
        return [
            'id' => $this->id,
            'nombre_test' => $this->nombre,
            'nombre_autor' => $this->autor,
            'nombre_autor_creador' => $this->autor_creador ? $this->autor_creador->nombre : null,
            'canvas' => $this->canvas,
            'fotos' => $this->getUserFotos($userEmail)
        ];
    }

    private function getUserFotos($userEmail)
    {
        return $this->versions->map(function ($version) use ($userEmail) {
            return $version->respuestas
                ->where('email_asignador', $userEmail)
                ->map(function ($respuesta) {
                    return $respuesta->user->foto ?? null;
                });
        })->flatten()->all();
    }
}
