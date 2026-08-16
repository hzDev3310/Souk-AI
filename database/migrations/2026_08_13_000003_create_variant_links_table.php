<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Many-to-many parent/child links between variant nodes.
     *
     * A child option (e.g. Size:XL) can now be attached under several parents
     * (e.g. Color:Red AND Color:Blue) while keeping a single SKU/price/stock.
     * A node is a ROOT when it never appears as a `child_variant_id`.
     * Existing single-parent rows are backfilled from `product_variants.parent_id`.
     */
    public function up(): void
    {
        Schema::create('variant_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('parent_variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignUuid('child_variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['parent_variant_id', 'child_variant_id'], 'idx_variant_links_unique');
        });

        DB::table('variant_links')->insertUsing(
            ['id', 'parent_variant_id', 'child_variant_id', 'created_at', 'updated_at'],
            DB::table('product_variants')
                ->whereNotNull('parent_id')
                ->selectRaw('UUID(), parent_id, id, NOW(), NOW()')
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('variant_links');
    }
};
