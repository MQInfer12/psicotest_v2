<?php

namespace Database\Seeders;

use App\Models\U_Permiso;
use App\Models\U_Rol;
use App\Models\U_Rol_Permiso;
use Illuminate\Database\Seeder;

class Permisos_Seeder extends Seeder
{
    public function run(): void
    {
        $permisos = [
            "Ver tests (asignación)",
            "Crear test",
            "Editar test",
            "Ver tests (resolución)",
            "Puede ser asignado",
            "Ver resultados",
            "Ver calendario",
            "Ver chat",
            "Ver usuarios"
        ];
        foreach ($permisos as $permiso) {
            U_Permiso::create([
                "descripcion" => $permiso
            ]);
        }

        $rols = [
            [
                "descripcion" => "Administrador",
                "por_defecto" => false,
                "permisos" => ["Ver tests (asignación)", "Ver resultados", "Ver usuarios"]
            ],
            [
                "descripcion" => "Paciente",
                "por_defecto" => true,
                "permisos" => ["Ver tests (resolución)", "Puede ser asignado"]
            ]
        ];
        foreach ($rols as $rol) {
            $u_rol = U_Rol::create([
                "descripcion" => $rol['descripcion'],
                "por_defecto" => $rol['por_defecto']
            ]);
            foreach ($rol['permisos'] as $permiso) {
                $u_permiso = U_Permiso::where('descripcion', $permiso)->firstOrFail();
                U_Rol_Permiso::create([
                    'id_rol' => $u_rol->id,
                    'id_permiso' => $u_permiso->id
                ]);
            }
        }
    }
}
