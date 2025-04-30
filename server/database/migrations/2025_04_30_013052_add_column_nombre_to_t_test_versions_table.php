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
        Schema::table('t_test_versions', function (Blueprint $table) {
            $table->string('nombre')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('t_test_versions', function (Blueprint $table) {
            if (Schema::hasColumn('u_users', 'nombre')) {
                $table->dropColumn('nombre');
            }
        });
    }
};
