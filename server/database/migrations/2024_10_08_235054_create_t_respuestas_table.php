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
        Schema::create('t_respuestas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_test_version')->constrained('t_test_versions')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('id_carpeta')->nullable()->constrained('t_carpetas')->cascadeOnUpdate()->nullOnDelete();

            $table->string('email_user')->nullable();
            $table->foreign('email_user')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('email_asignador')->nullable();
            $table->foreign('email_asignador')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');

            $table->string('estado');
            $table->json('resultados')->nullable();
            $table->text('interpretacion')->nullable();
            $table->date('fecha_asignado');
            $table->date('fecha_enviado')->nullable();
            $table->decimal('tiempo')->nullable();

            $table->timestamp('fecha_visible')->nullable()->default(null);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_respuestas');
    }
};
