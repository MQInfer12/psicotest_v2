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
            $table->string('institucion')->nullable();
            $table->string('curso')->nullable();
            $table->string('municipio')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('u_users', function (Blueprint $table) {
            if (Schema::hasColumn('u_users', 'institucion')) {
                $table->dropColumn('institucion');
            }
            if (Schema::hasColumn('u_users', 'curso')) {
                $table->dropColumn('curso');
            }
            if (Schema::hasColumn('u_users', 'municipio')) {
                $table->dropColumn('municipio');
            }
        });
    }
};
