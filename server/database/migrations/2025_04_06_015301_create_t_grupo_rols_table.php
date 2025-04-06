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
        Schema::create('t_grupo_rols', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_grupo')->constrained('t_grupos')->onDelete('cascade');
            $table->foreignId('id_rol')->constrained('u_rols')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_grupo_rols');
    }
};
