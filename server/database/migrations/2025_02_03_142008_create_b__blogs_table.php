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
        Schema::create('b_blogs', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('portada');
            $table->string('email_autor');
            $table->foreign('email_autor')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->json('config');
            $table->boolean('destacado')->default(false);

            $table->string('evento_nombre')->nullable();
            $table->timestamp('evento_fecha')->nullable();
            $table->decimal('evento_latitud', 10, 7)->nullable();
            $table->decimal('evento_longitud', 10, 7)->nullable();
            $table->string('evento_id_calendar')->nullable();
            $table->string('evento_link_calendar')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_blogs');
    }
};
