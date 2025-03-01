<?php

namespace Database\Seeders;

use App\Models\R_Contador;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Contador_Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        R_Contador::create([
            "citas_canceladas" => 0
        ]);
    }
}
