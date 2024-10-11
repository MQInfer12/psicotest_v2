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
        Schema::create('ia_test_plantillas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_test')->constrained('t_tests')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('id_plantilla')->constrained('ia_plantillas')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ia_test_plantillas');
    }
};
