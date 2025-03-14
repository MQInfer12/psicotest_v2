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
        Schema::create('u_users', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('nombre');
            $table->string('foto')->nullable();
            $table->string('genero')->nullable();
            $table->date('fecha_nacimiento')->nullable();

            $table->string('carrera')->nullable();
            $table->integer('semestre')->nullable();
            $table->string('codigo_estudiantil')->nullable();
            $table->integer('telefono')->nullable();
            $table->string('nombre_tutor')->nullable();
            $table->integer('telefono_tutor')->nullable();

            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();

            $table->boolean('estado')->default(true);
            $table->boolean('disponible')->default(true);

            $table->foreignId('id_rol')->nullable()->constrained('u_rols')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('u_users');
    }
};
