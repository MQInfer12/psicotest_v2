<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            Configuracion_Seeder::class,
            Tests_Seeder::class,
            Permisos_Seeder::class,
            Usuarios_Seeder::class,
            Respuestas_Seeder::class,
            Test_Answers_Seeder::class,
            Plantillas_Seeder::class,
            Blog_Seeder::class,
            Contador_Seeder::class,
        ]);
    }
}
