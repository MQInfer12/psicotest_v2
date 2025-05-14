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
        Schema::create('c_casos', function (Blueprint $table) {
            $table->id();
            $table->string('email_paciente');
            $table->foreign('email_paciente')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('nombre')->nullable();
            $table->string('motivo_cierre')->nullable();
            $table->timestamp('fecha_cierre')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
