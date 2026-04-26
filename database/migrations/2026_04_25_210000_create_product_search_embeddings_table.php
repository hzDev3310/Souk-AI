<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_search_embeddings', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('product_id')->unique()->constrained('products')->cascadeOnDelete();
            $table->string('content_hash', 64);
            $table->string('model');
            $table->unsignedInteger('dimensions')->nullable();
            $table->longText('embedding');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_search_embeddings');
    }
};
