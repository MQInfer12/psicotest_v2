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
    }
}
