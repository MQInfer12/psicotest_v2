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
        Schema::table('t_carpetas', function (Blueprint $table) {
            $table->foreignId('id_grupo')->nullable()->constrained('t_grupos', 'id')->onDelete('cascade')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('t_carpetas', function (Blueprint $table) {
            $table->dropForeign(['id_grupo']);
            $table->dropColumn('id_grupo');
        });
    }
};
