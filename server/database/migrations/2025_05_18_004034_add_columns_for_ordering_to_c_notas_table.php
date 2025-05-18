<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('c_notas', function (Blueprint $table) {
            $table->foreignId('id_caso')->nullable()->constrained('c_casos')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('id_cita')->nullable()->constrained('c_citas')->cascadeOnUpdate()->cascadeOnDelete();

            $table->dropForeign(['email_paciente']);
            $table->dropColumn('email_paciente');
            $table->dropColumn('fecha_hora');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('c_notas', function (Blueprint $table) {
            $table->dropForeign(['id_caso']);
            $table->dropForeign(['id_cita']);
            $table->dropColumn('id_caso');
            $table->dropColumn('id_cita');

            $table->string('email_paciente');
            $table->foreign('email_paciente')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamp('fecha_hora');
        });
    }
};
