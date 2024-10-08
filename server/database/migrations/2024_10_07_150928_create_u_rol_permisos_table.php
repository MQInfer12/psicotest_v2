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
        Schema::create('u_rol_permisos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_rol')->constrained('u_rols')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('id_permiso')->constrained('u_permisos')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('u_rol_permisos');
    }
};
