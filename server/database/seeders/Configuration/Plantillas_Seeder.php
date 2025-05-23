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
                "nombre" => "PLANTILLA EJM.",
                "descripcion" => "Ejemplo de generación de un informe con formato entrelazando información y contexto de uno o más tests psicológicos.",
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
                "nombre" => "OV: KUDER, PMA",
                "descripcion" => "Plantilla para la generación de informes psicológicos de orientación vocacional para estudiantes de colegio entrelazando información de los tests de KUDER y PMA.",
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

        IA_Plantilla::updateOrCreate(
            ['id' => 3],
            [
                "nombre" => "OV: CHASIDE",
                "descripcion" => "Plantilla para la generación de informes psicológicos de orientación vocacional para estudiantes de provincias basado solamente en el test CHASIDE.",
                "contexto" => file_get_contents(database_path('seeders/Data/Plantillas/3_contexto.txt')),
                "plantilla" => json_encode(json_decode(file_get_contents(database_path('seeders/Data/Plantillas/3_plantilla.json'))))
            ]
        );
    }
}
