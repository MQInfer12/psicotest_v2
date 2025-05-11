<?php

namespace Database\Seeders\Configuration;

use App\Models\IA_Plantilla;
use App\Models\IA_Test_Plantilla;
use Illuminate\Database\Seeder;

class Plantillas_Seeder extends Seeder
{
    public function run(): void
    {
        //! PLANTILLA 1

        IA_Plantilla::updateOrCreate(
            ['id' => 1],
            [
                "nombre" => "KUDER, PMA v1",
                "descripcion" => "Plantilla para la creación de informes psicológicos vocacionales para estudiantes de colegio.",
                "contexto" => null,
                "plantilla" => json_encode(json_decode(file_get_contents(database_path('seeders/Data/Plantillas/1_plantilla.json'))))
            ]
        );

        /* IA_Test_Plantilla::updateOrCreate(
            ['id' => 1],
            [
                "id_test" => 2,
                "id_plantilla" => 1
            ]
        );

        IA_Test_Plantilla::updateOrCreate(
            ['id' => 2],
            [
                "id_test" => 3,
                "id_plantilla" => 1
            ]
        ); */

        //! PLANTILLA 2

        IA_Plantilla::updateOrCreate(
            ['id' => 2],
            [
                "nombre" => "KUDER, PMA v2",
                "descripcion" => "Plantilla para la creación de informes psicológicos vocacionales para estudiantes de colegio.",
                "contexto" => file_get_contents(database_path('seeders/Data/Plantillas/2_contexto.txt')),
                "plantilla" => json_encode(json_decode(file_get_contents(database_path('seeders/Data/Plantillas/2_plantilla.json'))))
            ]
        );

        /* IA_Test_Plantilla::updateOrCreate(
            ['id' => 47],
            [
                "id_test" => 2,
                "id_plantilla" => 2
            ]
        );

        IA_Test_Plantilla::updateOrCreate(
            ['id' => 48],
            [
                "id_test" => 3,
                "id_plantilla" => 2
            ]
        ); */
    }
}
