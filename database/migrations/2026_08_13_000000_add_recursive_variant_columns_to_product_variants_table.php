<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Evolve the existing flat `product_variants` table into a recursive
     * tree structure without breaking current product/inventory data:
     *
     *  - `parent_id` self-reference (cascade delete) enables nested options.
     *  - `attribute_name` / `attribute_value` (e.g. Color -> Red).
     *  - `sku` becomes nullable (only leaf nodes must carry one).
     *  - `price_override` / `stock_quantity` decouple leaf pricing/stock from
     *    the legacy `price` / `stock` columns. Existing rows are backfilled
     *    so nothing already stored is lost.
     */
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->uuid('parent_id')->nullable()->after('product_id');
            $table->foreign('parent_id')
                ->references('id')->on('product_variants')
                ->cascadeOnDelete();

            $table->string('attribute_name')->nullable()->after('variant_name');
            $table->string('attribute_value')->nullable()->after('attribute_name');

            $table->decimal('price_override', 10, 2)->nullable()->after('price');
            $table->integer('stock_quantity')->default(0)->after('stock');
        });

        // Make `sku` nullable (a unique index allows multiple NULLs).
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropUnique('product_variants_sku_unique');
        });
        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('sku')->nullable()->change();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->index(['product_id'], 'idx_variants_product');
            $table->index(['parent_id'], 'idx_variants_parent');
        });

        // Backfill: promote legacy flat rows to root attribute nodes.
        DB::table('product_variants')
            ->whereNull('parent_id')
            ->update([
                'attribute_name' => 'Option',
                'attribute_value' => DB::raw('variant_name'),
                'price_override' => DB::raw('price'),
                'stock_quantity' => DB::raw('stock'),
            ]);
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropIndex('idx_variants_product');
            $table->dropIndex('idx_variants_parent');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('sku')->unique()->change();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'attribute_name', 'attribute_value', 'price_override', 'stock_quantity']);
        });
    }
};
