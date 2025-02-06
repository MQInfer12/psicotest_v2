<?php

namespace Database\Seeders;

use App\Constants\Permisos;
use App\Models\U_Rol;
use Illuminate\Database\Seeder;

class Permisos_Seeder extends Seeder
{
    public function run(): void
    {
        $rols = [
            [
                "descripcion" => "Administrador",
                "por_defecto" => false,
                "permisos" => [
                    Permisos::VER_TESTS_ASIGNACION,
                    Permisos::VER_RESULTADOS,
                    Permisos::VER_PLANTILLAS,
                    Permisos::VER_CALENDARIO,
                    Permisos::COMPARTIR_TEST,
                    Permisos::CONFIGURAR,
                    Permisos::VER_USUARIOS,
                    Permisos::VER_CITAS,
                    Permisos::ANADIR_HORARIOS,
                    Permisos::VER_BLOGS
                ]
            ],
            [
                "descripcion" => "Paciente",
                "por_defecto" => true,
                "permisos" => [
                    Permisos::VER_TESTS_RESOLUCION,
                    Permisos::PUEDE_SER_ASIGNADO,
                    Permisos::VER_CALENDARIO,
                    Permisos::VER_HORARIOS,
                    Permisos::VER_BLOGS
                ]
            ]
        ];
        foreach ($rols as $rol) {
            U_Rol::create([
                "descripcion" => $rol['descripcion'],
                "por_defecto" => $rol['por_defecto'],
                "permisos" => $rol['permisos']
            ]);
        }
    }
}
