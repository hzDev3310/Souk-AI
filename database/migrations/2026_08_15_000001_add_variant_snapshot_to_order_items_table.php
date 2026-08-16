<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Snapshot the selected variant path in each order item so the order
     * remains readable even after the product owner deletes variants.
     *
     *  - `variant_name`: human-readable path, e.g. "Rouge > S" or "Call of Duty > Pro".
     *  - `variant_data`: JSON with the full variant tree path (attribute names,
     *    values, SKU, option_value) for each selected node from root to leaf.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->string('variant_name')->nullable()->after('variant_id');
            $table->json('variant_data')->nullable()->after('variant_name');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['variant_name', 'variant_data']);
        });
    }
};
