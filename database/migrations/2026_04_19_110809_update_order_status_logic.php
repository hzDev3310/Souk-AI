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
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('PENDING')->after('influencer_id');
            $table->foreignUuid('driver_id')->nullable()->after('totalAmount')->constrained('shipping_emps')->nullOnDelete();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('status')->default('PENDING')->after('price');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['driver_id']);
            $table->dropColumn(['driver_id', 'status']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])->default('PENDING')->after('influencer_id');
        });
    }
};
