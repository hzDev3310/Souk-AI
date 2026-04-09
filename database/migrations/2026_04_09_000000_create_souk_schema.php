<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Roles (1-to-1 mapped with Users)
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('codePostal')->nullable();
            $table->float('lon')->nullable();
            $table->string('lat')->nullable();
            $table->timestamps();
        });

        Schema::create('influencers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('referralCode')->unique();
            $table->float('commissionRate')->default(5);
            $table->string('profilePicture')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('codePostal')->nullable();
            $table->string('cin')->nullable();
            $table->string('rib')->nullable();
            $table->string('d17')->nullable();
            $table->boolean('isActive')->default(true);
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('stores', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('storePhone')->nullable();
            $table->string('address')->nullable();
            $table->string('responsibleCin')->nullable();
            $table->string('matriculeFiscale')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover')->nullable();
            $table->string('rib')->nullable();
            $table->boolean('isActive')->default(true);
            $table->json('categories')->nullable();
            $table->decimal('promo', 5, 2)->default(0);
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('admins', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->float('platformCommissionAdmin')->default(10);
            $table->float('platformCommissionShare')->default(5);
            $table->timestamps();
        });

        Schema::create('shipping_companies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('contactInfo')->nullable();
            $table->string('companyPhone')->nullable();
            $table->string('responsiblePhone')->nullable();
            $table->string('address')->nullable();
            $table->string('cin')->nullable();
            $table->string('matriculeFiscale')->nullable();
            $table->string('rib')->nullable();
            $table->timestamps();
        });

        Schema::create('shipping_emps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('pdp')->nullable(); 
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('cin')->nullable();
            $table->string('rib')->nullable();
            $table->timestamps();
        });

        // Catalog 
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('store_id')->constrained('stores')->cascadeOnDelete();
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
            $table->decimal('promo', 5, 2)->default(0);
            $table->json('categories')->nullable();
            $table->timestamps();
        });

        Schema::create('category_product', function (Blueprint $table) {
            $table->foreignUuid('category_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'product_id']);
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('variant_name'); 
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2)->nullable(); 
            $table->integer('stock')->default(0);
            $table->timestamps();
        });

        Schema::create('product_albums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('imageUrl');
            $table->boolean('isPrimary')->default(false);
            $table->timestamps();
        });

        // Sales & Finances
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->constrained('clients');
            $table->foreignUuid('influencer_id')->nullable()->constrained('influencers')->nullOnDelete();
            $table->enum('status', ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])->default('PENDING');
            $table->decimal('totalAmount', 10, 2);
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained('products');
            $table->foreignUuid('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        Schema::create('factures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('factureNumber')->unique();
            $table->enum('type', ['STORE', 'INFLUENCER', 'ADMIN', 'SHIPPING', 'SHIPPING_EMP']);
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['UNPAID', 'PENDING', 'PAID'])->default('UNPAID');
            $table->timestamps();
        });

        // Support & Moderation
        Schema::create('logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('userRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP']);
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('targetType', ['CLIENT', 'INFLUENCER', 'STORE', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'USER']);
            $table->uuid('targetId');
            $table->string('title');
            $table->text('message');
            $table->boolean('isSeen')->default(false);
            $table->timestamps();
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reporterId');
            $table->uuid('reportedTargetId');
            $table->enum('reportedTargetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP']);
            $table->text('description');
            $table->string('status')->default('PENDING'); 
            $table->timestamps();
        });

        Schema::create('block_lists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reporterId');
            $table->uuid('reportedTargetId');
            $table->enum('reportedTargetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP']);
            $table->timestamps();
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('targetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'PRODUCT']);
            $table->uuid('targetId');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('targetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'PRODUCT']);
            $table->uuid('targetId');
            $table->tinyInteger('rating');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('block_lists');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('logs');
        Schema::dropIfExists('factures');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('product_albums');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('category_product');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('shipping_emps');
        Schema::dropIfExists('shipping_companies');
        Schema::dropIfExists('admins');
        Schema::dropIfExists('stores');
        Schema::dropIfExists('influencers');
        Schema::dropIfExists('clients');
    }
};