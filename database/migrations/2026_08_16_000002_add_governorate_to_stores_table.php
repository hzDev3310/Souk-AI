<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Stores are physically located in a Tunisian governorate.
     * Their delivery zone is derived from the governorate via the
     * admin-managed geo_zones table.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('governorate', 50)->nullable()->default('TUNIS')->after('promo');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('governorate');
        });
    }
};