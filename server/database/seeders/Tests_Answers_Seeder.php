<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;


class Test_Answers_Seeder extends Seeder
{

    public function run(): void
    {
        $pma_answers = File::get('seeders/Tests_Answers/pma.json');
        $data = json_decode($pma_answers, true);

        
        
        // foreach ($tests as $t) {
        //     $testData = json_decode(File::get($t), true);

        //     $test = T_Test::create([
        //         'autor' => $testData['autor'],
        //         'nombre' => $testData['nombre'],
        //         'canvas' => json_encode($testData['canvas']),
        //     ]);

        //     foreach ($testData['versions'] as $versionData) {
        //         $versionData['id_test'] = $test->id; 
        //         $versionData['fecha'] = now(); 
        //         $versionData['test'] = json_encode($versionData['test']);
        //         T_TestVersion::create($versionData); 
        //     }
        // }
    }
}
