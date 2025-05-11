<?php

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
        DB::table('c_citas')
            ->whereNull('metodo')
            ->update(['metodo' => 'Primera cita del caso']);

        Schema::table('c_citas', function (Blueprint $table) {
            //? agregar columnas nuevas
            $table->unsignedBigInteger('id_caso')->nullable(false)->change();
            $table->foreignId('id_motivo_consulta')->nullable()->constrained('c_motivo_consultas')->cascadeOnUpdate()->nullOnDelete();
            $table->date('fecha_cierre_clinico')->nullable();

            //? quitar columnas antiguas
            $table->dropForeign(['email_paciente']);
            $table->dropColumn(['email_paciente', 'derivado_a', 'resumen']);

            //? modificar columnas antiguas
            $table->string('metodo')->nullable(false)->default('Primera cita del caso')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        throw new \Exception('Esta migración no se puede deshacer');
    }
};
