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
        Schema::create('c_citas', function (Blueprint $table) {
            $table->id();
            $table->string('id_calendar');
            $table->string('email_psicologo');
            $table->foreign('email_psicologo')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('email_paciente');
            $table->foreign('email_paciente')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_final');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_citas');
    }
};
