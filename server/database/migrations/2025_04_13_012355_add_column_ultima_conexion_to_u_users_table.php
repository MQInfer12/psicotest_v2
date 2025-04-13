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
        Schema::table('u_users', function (Blueprint $table) {
            $table->timestamp('ultima_conexion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('u_users', function (Blueprint $table) {
            if (Schema::hasColumn('u_users', 'ultima_conexion')) {
                $table->dropColumn('ultima_conexion');
            }
        });
    }
};
