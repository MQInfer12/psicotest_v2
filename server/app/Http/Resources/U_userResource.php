<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class U_userResource extends JsonResource
{
    public function toArray($request)
    {
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

            'contador_citas' => count($this->citas_previas),
            'fecha_ultima_cita' => $this->citas_previas->last() ? $this->citas_previas->last()->fecha : null,

            'estado' => $this->estado,
            'permisos' => $this->rol->permisos,
            'grupos' => T_GrupoResource::collection($this->grupos()),
            'id_rol' => $this->id_rol,
            'cita_proxima' => $this->cita_proxima ? new C_CitaResource($this->cita_proxima) : null,

            /* 'requerimientos' => $this->requerimientos(), */

            'disponible' => $this->disponible,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'ultima_conexion' => $this->ultima_conexion,
        ];
    }
}
