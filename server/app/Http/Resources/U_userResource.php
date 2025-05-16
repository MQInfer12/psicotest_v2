<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class U_userResource extends JsonResource
{
    public function toArray($request)
    {
        $citas = $this->citas;
        $cita_proxima = $this->cita_proxima;

        return [
            'email' => $this->email,
            'nombre' => $this->nombre,
            'foto' => $this->foto,
            'genero' => $this->genero,
            'fecha_nacimiento' => $this->fecha_nacimiento,

            'nombre_verificado' => $this->nombre_verificado,

            'carrera' => $this->carrera,
            'semestre' => $this->semestre,
            'codigo_estudiantil' => $this->codigo_estudiantil,
            'telefono' => $this->telefono,
            'nombre_tutor' => $this->nombre_tutor,
            'telefono_tutor' => $this->telefono_tutor,

            'institucion' => $this->institucion,
            'curso' => $this->curso,
            'municipio' => $this->municipio,

            'cita_proxima' => $cita_proxima ? new C_CitaResource($cita_proxima) :  null,
            'contador_citas' => count($citas),
            'contador_citas_confirmadas' => count($citas->where('fecha_cierre_clinico', '!=', null)),
            'contador_citas_sin_confirmar' => count($citas->where('fecha_cierre_clinico', '=', null)),
            'caso_sin_cerrar' => !!$this->casos->where('fecha_cierre', '=', null)->first(),
            'fecha_ultima_cita' => $citas->first()?->fecha,

            'estado' => $this->estado,
            'permisos' => $this->rol->permisos,
            'grupos' => T_GrupoResource::collection($this->grupos()),
            'id_rol' => $this->id_rol,

            'disponible' => $this->disponible,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'ultima_conexion' => $this->ultima_conexion,
        ];
    }
}
