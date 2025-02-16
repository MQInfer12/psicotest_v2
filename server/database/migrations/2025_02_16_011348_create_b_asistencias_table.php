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
        Schema::create('b_asistencias', function (Blueprint $table) {
            $table->id();
            $table->string('email_user');
            $table->foreign('email_user')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('id_evento')->constrained('b_eventos')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('id_calendar')->nullable();
            $table->string('link_calendar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_asistencias');
    }
};
