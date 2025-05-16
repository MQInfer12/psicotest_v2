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
        Schema::table('c_motivos', function (Blueprint $table) {
            $table->string('cancelado_por');
            $table->foreign('cancelado_por')->references('email')->on('u_users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('c_motivos', function (Blueprint $table) {
            $table->dropForeign(['cancelado_por']);
            $table->dropColumn('cancelado_por');
        });
    }
};
