<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('t_carpetas', function (Blueprint $table) {
            $table->boolean('global')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('t_carpetas', function (Blueprint $table) {
            $table->dropColumn('global');
        });
    }
};
