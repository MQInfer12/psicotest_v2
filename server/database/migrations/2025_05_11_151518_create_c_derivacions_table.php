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
        Schema::create('c_derivacions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_caso')->constrained('c_casos')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('derivado_a');
            $table->text('resumen');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_derivacions');
    }
};
