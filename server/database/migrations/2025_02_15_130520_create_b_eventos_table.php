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
        Schema::create('b_eventos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable();
            $table->timestamp('fecha')->nullable();
            $table->decimal('latitud', 10, 7)->nullable();
            $table->decimal('longitud', 10, 7)->nullable();
            $table->text('direccion')->nullable();
            $table->foreignId('id_blog')->constrained('b_blogs')->onDelete('cascade')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_eventos');
    }
};
