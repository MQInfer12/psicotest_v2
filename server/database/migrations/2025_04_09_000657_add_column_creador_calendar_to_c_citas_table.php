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
        Schema::table('c_citas', function (Blueprint $table) {
            $table->string('creador_calendar')->default('psicologiaunifranz@gmail.com');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('c_citas', function (Blueprint $table) {
            if (Schema::hasColumn('c_citas', 'creador_calendar')) {
                $table->dropColumn('creador_calendar');
            }
        });
    }
};
