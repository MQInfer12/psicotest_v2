<?php

namespace Database\Seeders;

use App\Models\T_Respuesta;
use App\Models\U_user;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;


class Test_Answers_Seeder extends Seeder
{

  public function run(): void
  {
    $pma_answers = File::get( database_path('seeders/Tests_Answers/pma.json'));
    $data = json_decode($pma_answers, true);

    foreach ($data as $item) {

      $yearsToSubtract = $item['datos_generales']['edad'] ?? null;
      $fechaNacimiento = null;
      if($yearsToSubtract != null)
      {
        $yearResult = Carbon::now()->year - $yearsToSubtract;

        // Crea la fecha usando el primer día del primer mes de ese año
        $fechaNacimiento = Carbon::create($yearResult, 1, 1);
      }

      $user = U_user::create([
        'email' => $item['datos_generales']['correo'],
        'nombre' => $item['datos_generales']['nombre'],
        'genero' => $item['datos_generales']['sexo'],
        'fecha_nacimiento' => $fechaNacimiento,
        'estado' => true,
      ]);

      T_Respuesta::create([
        'id_test_version' => 3,
        'email_user' => $user->email,
        'email_asignador' => "psicologiaunifranz@gmail.com",
        'estado' => true,
        'resultados' =>  json_encode($item['respuestas']),
        'fecha_asignado' => '2024-09-24',
        'fecha_enviado' => '2024-09-24',
      ]);
    }
  }
}
