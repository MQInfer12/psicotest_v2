<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\T_Test;
use App\Models\T_TestVersion;


class Tests_Seeder extends Seeder
{

    public function run(): void
    {
        $tests = File::files(database_path('seeders/Tests_Data'));
        
        foreach ($tests as $t) {
            $testData = json_decode(File::get($t), true);

            $test = T_Test::create([
                'autor' => $testData['autor'],
                'nombre' => $testData['nombre'],
                'canvas' => json_encode($testData['canvas']),
            ]);

            foreach ($testData['versions'] as $versionData) {
                $versionData['id_test'] = $test->id; 
                $versionData['fecha'] = now(); 
                $versionData['test'] = json_encode($versionData['test']);
                T_TestVersion::create($versionData); 
            }
        }
    }
}
