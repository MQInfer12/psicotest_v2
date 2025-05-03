<?php

namespace Database\Seeders\Configuration;

use App\Constants\Permisos;
use App\Models\T_Grupo;
use App\Models\T_Grupo_Rol;
use App\Models\U_Rol;
use Illuminate\Database\Seeder;

class Permisos_Seeder extends Seeder
{
    public function run(): void
    {
        //! GRUPOS

        T_Grupo::updateOrCreate(
            ['id' => 1],
            [
                "descripcion" => "Admisiones",
            ]
        );

        T_Grupo::updateOrCreate(
            ['id' => 2],
            [
                "descripcion" => "Gabinete",
            ]
        );

        T_Grupo::updateOrCreate(
            ['id' => 3],
            [
                "descripcion" => "Provincias",
            ]
        );

        //! ROLES

        U_Rol::updateOrCreate(
            ["id" => 1],
            [
                "descripcion" => "Administrador",
                "por_defecto" => false,
                "permisos" => [
                    Permisos::VER_TESTS_ASIGNACION,
                    Permisos::COMPARTIR_TEST,
                    Permisos::VER_RESULTADOS,
                    Permisos::VER_TODAS_LAS_CARPETAS,
                    Permisos::VER_PLANTILLAS,
                    Permisos::VER_CALENDARIO,
                    Permisos::VER_USUARIOS,
                    Permisos::CONFIGURAR,
                    Permisos::VER_CITAS,
                    Permisos::VER_BLOGS,
                    Permisos::CREAR_BLOGS,
                    Permisos::DESTACAR_BLOGS,
                    Permisos::ADMINISTRAR_PACIENTES,
                ]
            ]
        );

        U_Rol::updateOrCreate(
            ["id" => 2],
            [
                "descripcion" => "Paciente",
                "por_defecto" => true,
                "permisos" => [
                    Permisos::VER_TESTS_RESOLUCION,
                    Permisos::PUEDE_SER_ASIGNADO,
                    Permisos::VER_CALENDARIO,
                    Permisos::VER_BLOGS
                ]
            ]
        );

        U_Rol::updateOrCreate(
            ["id" => 3],
            [
                "descripcion" => "Admisiones",
                "por_defecto" => false,
                "permisos" => [
                    Permisos::VER_TESTS_ASIGNACION,
                    Permisos::COMPARTIR_TEST,
                    Permisos::VER_RESULTADOS,
                    Permisos::CONFIGURAR,
                    Permisos::VER_BLOGS,
                    Permisos::CREAR_BLOGS,
                ]
            ]
        );

        U_Rol::updateOrCreate(
            ["id" => 4],
            [
                "descripcion" => "Gabinete",
                "por_defecto" => false,
                "permisos" => [
                    Permisos::VER_TESTS_ASIGNACION,
                    Permisos::COMPARTIR_TEST,
                    Permisos::VER_RESULTADOS,
                    Permisos::VER_CALENDARIO,
                    Permisos::VER_CITAS,
                    Permisos::VER_BLOGS,
                    Permisos::CREAR_BLOGS,
                ]
            ]
        );

        //! ROLES CON GRUPOS

        T_Grupo_Rol::updateOrCreate(
            ['id' => 1],
            [
                'id_rol' => 3,
                'id_grupo' => 1,
            ]
        );

        T_Grupo_Rol::updateOrCreate(
            ['id' => 2],
            [
                'id_rol' => 4,
                'id_grupo' => 2,
            ]
        );
    }
}
