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
        Schema::create('stores', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('responsible_name');
            $table->string('responsible_phone');
            $table->string('store_phone');
            $table->text('address');
            $table->string('responsible_cin');
            $table->string('matricule_fiscale');
            $table->string('logo')->nullable();
            $table->string('rib');
            $table->boolean('is_active')->default(true);
            $table->json('categories')->nullable();
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};