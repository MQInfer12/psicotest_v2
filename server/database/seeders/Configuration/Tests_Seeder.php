<?php

namespace Database\Seeders\Configuration;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\T_Test;
use App\Models\T_TestVersion;


class Tests_Seeder extends Seeder
{

    public function run(): void
    {
        $tests = File::files(database_path('seeders/Data/Tests'));

        foreach ($tests as $t) {
            $testData = json_decode(File::get($t), true);

            T_Test::updateOrCreate(
                ['id' => $testData['id']],
                [
                    'autor' => $testData['autor'],
                    'nombre' => $testData['nombre'],
                    'canvas' => json_encode($testData['canvas']),
                ]
            );

            foreach ($testData['versions'] as $versionData) {
                T_TestVersion::updateOrCreate(
                    ['id' => $versionData['id']],
                    [
                        'id_test' => $testData['id'],
                        'version' => $versionData['version'],
                        'test' => json_encode($versionData['test']),
                        'fecha' => now(),
                        'nombre' => $versionData['nombre'],
                    ]
                );
            }
        }
    }
}
