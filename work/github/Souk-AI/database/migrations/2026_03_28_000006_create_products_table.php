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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('store_id')->nullable()->constrained('stores')->onDelete('cascade');
            $table->foreignUuid('influencer_id')->nullable()->constrained('influencers')->onDelete('cascade');
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('condition', ['NEW', 'GOOD', 'USED']);
            $table->integer('stock')->default(0);
            $table->string('slug')->unique();
            $table->decimal('promo', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};