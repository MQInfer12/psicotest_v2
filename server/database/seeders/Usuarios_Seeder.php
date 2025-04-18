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
            "nombre" => "Neurall Unifranz",
            "foto" => "https://lh3.googleusercontent.com/a/ACg8ocKZbzbynjJrikcmob4oEH4iX63zbeIPQoIWuquU8azsNV9rj_0=s96-c",
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

        U_user::create([
            "email" => "michell.von@unifranz.edu.bo",
            "nombre" => "Michell Raiza Von Schoettler Quinteros",
            "foto" => "https://lh3.googleusercontent.com/a/ACg8ocInSj6eZlhCKcqXOHmUEUDf_E31OXvKMhUxd5VAQeE6NSN1m6zv=s96-c",
            "estado" => true,
            "id_rol" => 1
        ]);
    }
}
