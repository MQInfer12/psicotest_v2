<?php

use App\Models\C_Caso;
use App\Models\C_Cita;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $pacientes = DB::table('c_citas')
            ->select('email_paciente')
            ->distinct()
            ->pluck('email_paciente');

        foreach ($pacientes as $email) {
            $casoId = DB::table('c_casos')->insertGetId([
                'email_paciente' => $email,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('c_citas')
                ->where('email_paciente', $email)
                ->update(['id_caso' => $casoId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
