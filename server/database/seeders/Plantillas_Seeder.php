<?php

namespace Database\Seeders;

use App\Models\IA_Plantilla;
use App\Models\IA_Test_Plantilla;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Plantillas_Seeder extends Seeder
{
    public function run(): void
    {
        $plantilla = IA_Plantilla::create([
            "descripcion" => "Cruce de KUDER y PMA",
            "plantilla" => '[{"type":"title","content":"1. Introducción"},{"type":"paragraph","content":"Este informe presenta los resultados del proceso de orientación vocacional realizado con [Nombre del paciente], con el objetivo de identificar intereses, habilidades y posibles trayectorias profesionales que se alineen con sus aspiraciones y características personales."},{"type":"title","content":"2. Metodología"},{"type":"paragraph","content":"Se emplearon las siguientes herramientas y técnicas:"},{"type":"paragraph","content":"Se describiría las pruebas tomadas:"},{"type":"vignette","title":"Test de Kuder:","content":"Se aplicó el test de Kuder para evaluar los intereses vocacionales del estudiante."},{"type":"vignette","title":"PMA (Prueba de Motivación Académica):","content":"Se utilizó esta prueba para identificar la motivación del estudiante hacia diferentes áreas académicas y profesionales."},{"type":"title","content":"3. Resultados"},{"type":"subtitle","content":"3.1. Intereses Vocacionales (Resultados del Test de Kuder)"},{"type":"vignette","title":"Áreas de interés predominantes:","content":"[Descripción de las áreas más destacadas según los resultados del test de Kuder.]"},{"type":"vignette","title":"Ranking de intereses:","content":"[Resumen del ranking de intereses, indicando las tres principales áreas.]"},{"type":"subtitle","content":"3.2. Motivación Académica (Resultados del PMA)"},{"type":"vignette","title":"Niveles de motivación:","content":"[Descripción de los niveles de motivación identificados, destacando las áreas de alta motivación y aquellas que requieren atención.]"},{"type":"vignette","title":"Áreas de interés y compromiso:","content":"[Resumen de las áreas en las que el estudiante se muestra más comprometido y motivado.]"},{"type":"subtitle","content":"3.3. Habilidades y Fortalezas"},{"type":"vignette","title":"Habilidades identificadas:","content":"[Lista de habilidades destacadas en relación con los intereses del test de Kuder, la PMA y el MAPI.]"},{"type":"vignette","title":"Fortalezas personales:","content":"[Breve descripción de las cualidades que destacan en el estudiante.]"},{"type":"subtitle","content":"3.4. Áreas de Mejora"},{"type":"vignette","title":"Fortalezas personales:","content":"[Descripción de áreas donde el estudiante podría beneficiarse de desarrollo adicional.]"},{"type":"title","content":"4. Recomendaciones Vocacionales"},{"type":"paragraph","content":"Basado en los intereses y habilidades del estudiante, se recomienda las siguientes carreras o áreas de especialización:"},{"type":"vignette","title":"[Opción 1]:","content":"[Descripción breve de la opción, incluyendo posibles carreras y ámbitos laborales.]"},{"type":"vignette","title":"[Opción 2]:","content":"[Descripción breve de la opción.]"},{"type":"vignette","title":"[Opción 3]:","content":"[Descripción breve de la opción.]"},{"type":"title","content":"5. Conclusiones"},{"type":"paragraph","content":"[Una breve conclusión acerca de los gustos, recomendaciones y análisis de los tests proporcionados del paciente]"}]'
        ]);

        IA_Test_Plantilla::create([
            "id_test" => 2,
            "id_plantilla" => $plantilla->id
        ]);

        IA_Test_Plantilla::create([
            "id_test" => 3,
            "id_plantilla" => $plantilla->id
        ]);
    }
}
