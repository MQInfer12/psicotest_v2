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
        Schema::create('c_ocupacions', function (Blueprint $table) {
            $table->id();
            $table->string('email_user');
            $table->foreign('email_user')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('descripcion');
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
        Schema::dropIfExists('c_ocupacions');
    }
};
