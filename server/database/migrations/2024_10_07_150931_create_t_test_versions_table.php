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
        Schema::create('t_test_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_test')->constrained('t_tests')->cascadeOnUpdate()->cascadeOnDelete();
            $table->integer('version');
            $table->json('test');
            $table->date('fecha');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_test_versions');
    }
};
