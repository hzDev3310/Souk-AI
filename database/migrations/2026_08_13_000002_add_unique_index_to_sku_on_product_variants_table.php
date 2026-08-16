<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Re-introduce uniqueness on `sku`. MySQL/SQLite unique indexes allow
     * multiple NULL rows, so parent (non-leaf) variants can leave SKU empty
     * while leaf SKUs must stay unique.
     */
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->unique('sku', 'product_variants_sku_unique');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropUnique('product_variants_sku_unique');
        });
    }
};
