<?php

namespace Database\Seeders;

use App\Models\U_user;
use Illuminate\Database\Seeder;

class Usuarios_Seeder extends Seeder
{
    public function run(): void
    {
        U_user::create([
            "email" => "psicologiaunifranz@gmail.com",
            "nombre" => "Psicotest Unifranz",
            "foto" => "https://lh3.googleusercontent.com/a/ACg8ocKsysNnPCBoQtQbX4pVZ2ahjB-mIc77L0DkX2I675nZjA62ijw=s96-c",
            "genero" => "Hombre",
            "fecha_nacimiento" => "2000-01-01",
            "estado" => true,
            "id_rol" => 1
        ]);

        U_user::create([
            "email" => "cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo",
            "nombre" => "MAURICIO SANTIAGO MOLINA QUINTEROS",
            "foto" => "https://lh3.googleusercontent.com/a/ACg8ocIpR6jiZMAwqRKwZIDWyLoFxZCYPQQ4NzMkBAe-AS3y75491vA=s96-c",
            "genero" => "Hombre",
            "fecha_nacimiento" => "2006-03-27",
            "estado" => true,
            "id_rol" => 2
        ]);

        U_user::create([
            "email" => "veymar15ganci@gmail.com",
            "nombre" => "Veymar Illanez Ganci",
            "foto" => "https://lh3.googleusercontent.com/a/ACg8ocJa0hBZJf_SXP_JM_lh4GOez7PDbWr9kGi1Q-2kXq023yLzDg=s96-c",
            "genero" => "Hombre",
            "fecha_nacimiento" => "2000-09-15",
            "estado" => true,
            "id_rol" => 2
        ]);

        U_user::create([
            "email" => "ramirezrodriguezcarolina98@gmail.com",
            "nombre" => "carolina Ramirez R.",
            "foto" => "https://lh3.googleusercontent.com/a/ACg8ocJqoR0HMIe1zGT-9jvvHcaD-QE8rgYIKmFNTs0TW5ZUXRFLXMaY=s96-c",
            "genero" => "Mujer",
            "fecha_nacimiento" => null,
            "estado" => true,
            "id_rol" => 2
        ]);
    }
}
