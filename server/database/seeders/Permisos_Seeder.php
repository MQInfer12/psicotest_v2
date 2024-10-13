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
                "permisos" => [Permisos::VER_TESTS_ASIGNACION, Permisos::VER_RESULTADOS, Permisos::VER_USUARIOS, Permisos::COMPARTIR_TEST]
            ],
            [
                "descripcion" => "Paciente",
                "por_defecto" => true,
                "permisos" => [Permisos::VER_TESTS_RESOLUCION, Permisos::PUEDE_SER_ASIGNADO]
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
