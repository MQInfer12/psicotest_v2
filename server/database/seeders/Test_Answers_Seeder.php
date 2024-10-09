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
    // =========== START: PMA_KUDER ===========
    $pma_answers = File::get(database_path('seeders/Tests_Answers/pma_kuder.json'));
    $data = json_decode($pma_answers, true);

    foreach ($data as $item) {
      $yearsToSubtract = $item['datos_generales']['edad'] ?? null;
      $fechaNacimiento = null;
      if ($yearsToSubtract != null) {
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
        'id_rol' => 2
      ]);

      T_Respuesta::create([
        'id_test_version' => 3,
        'email_user' => $user->email,
        'email_asignador' => "psicologiaunifranz@gmail.com",
        'estado' => "Enviado",
        'resultados' =>  json_encode($item['respuestas']["pma"]),
        'fecha_asignado' => '2024-09-24',
        'fecha_enviado' => '2024-09-24',
      ]);

      if (count($item['respuestas']['kuder']) > 0) {
        T_Respuesta::create([
          'id_test_version' => 2,
          'email_user' => $user->email,
          'email_asignador' => "psicologiaunifranz@gmail.com",
          'estado' => "Enviado",
          'resultados' =>  json_encode($item['respuestas']["kuder"]),
          'fecha_asignado' => '2024-09-24',
          'fecha_enviado' => '2024-09-24',
        ]);
      }
    }
    // =========== END: PMA_KUDER ===========

    // =========== START: BIG_FIVE ===========
    $big_five_answers = File::get(database_path('seeders/Tests_Answers/big_five.json'));
    $data_big = json_decode($big_five_answers, true);

    foreach ($data_big as $item) {
      $yearsToSubtract = $item['edad'] ?? null;
      $fechaNacimiento = null;
      if ($yearsToSubtract != null) {
        $yearResult = Carbon::now()->year - $yearsToSubtract;

        // Crea la fecha usando el primer día del primer mes de ese año
        $fechaNacimiento = Carbon::create($yearResult, 1, 1);
      }
      if ($item['email'] != 'cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo') {
        $user = U_user::create([
          'email' => $item['email'],
          'nombre' => $item['nombre'],
          "foto" => $item['foto'],
          'fecha_nacimiento' => $fechaNacimiento,
          'estado' => true,
          'id_rol' => 2
        ]);
      }

      T_Respuesta::create([
        'id_test_version' => 4,
        'email_user' => $item['email'] != 'cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo' ? $user->email : 'cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo',
        'email_asignador' => "psicologiaunifranz@gmail.com",
        'estado' => "Enviado",
        'resultados' =>  json_encode($item['respuestas']),
        'fecha_asignado' => $item['fecha'],
        'fecha_enviado' => $item['fecha'],
      ]);
    }
    // =========== END: BIG_FIVE ===========
  }
}
