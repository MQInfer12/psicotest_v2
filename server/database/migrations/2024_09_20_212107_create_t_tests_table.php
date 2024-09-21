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
        Schema::create('t_tests', function (Blueprint $table) {
            $table->id();
            $table->string('autor')->nullable();
            $table->string('email_autor')->nullable();
            $table->foreign('email_autor')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('set null');
            $table->string('nombre');
            $table->json('canvas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_tests');
    }
};
