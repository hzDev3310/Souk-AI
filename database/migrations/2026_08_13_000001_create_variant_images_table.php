<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Junction table linking images to any node in the variant tree.
     * `image_id` references the existing `product_albums` store (the app's
     * canonical product image table) so no parallel image table is created.
     */
    public function up(): void
    {
        Schema::create('variant_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignUuid('image_id')->constrained('product_albums')->cascadeOnDelete();
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->unique(['variant_id', 'image_id'], 'idx_variant_images_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variant_images');
    }
};
