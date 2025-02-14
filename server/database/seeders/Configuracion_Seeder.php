<?php

namespace Database\Seeders;

use App\Models\App_Configuracion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Configuracion_Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        App_Configuracion::create([
            "configuraciones" => json_encode([
                "gpt_model" => "gpt-4o-mini "
            ])
        ]);
    }
}
