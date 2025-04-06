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
        if (Schema::hasTable('t_carpeta_compartirs')) {
            Schema::table('t_carpeta_compartirs', function (Blueprint $table) {
                $table->dropForeign(['email_user']);
                $table->dropForeign(['id_carpeta']);
            });
        }
        Schema::dropIfExists('t_carpeta_compartirs');
    }
};
