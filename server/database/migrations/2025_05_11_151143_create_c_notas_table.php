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
        Schema::create('c_notas', function (Blueprint $table) {
            $table->id();
            $table->string('email_paciente');
            $table->foreign('email_paciente')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('email_psicologo');
            $table->foreign('email_psicologo')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->text('descripcion');
            $table->timestamp('fecha_hora');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_notas');
    }
};
