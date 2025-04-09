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
        Schema::create('c_motivos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_cita')->nullable()->constrained('c_citas')->cascadeOnUpdate()->nullOnDelete();
            $table->text('descripcion');
            $table->string('tipo'); //puede ser "reprogramacion" o "cancelacion"
            $table->string('email_psicologo');
            $table->foreign('email_psicologo')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('email_paciente');
            $table->foreign('email_paciente')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->date('fecha_anterior');
            $table->time('hora_inicio_anterior');
            $table->time('hora_final_anterior');
            $table->date('fecha_nueva')->nullable();
            $table->time('hora_inicio_nueva')->nullable();
            $table->time('hora_final_nueva')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_motivos');
    }
};
