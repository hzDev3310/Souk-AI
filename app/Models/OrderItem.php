<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class OrderItem extends Model {
    use HasUuids;
    protected $fillable = ['order_id', 'product_id', 'variant_id', 'quantity', 'price', 'status'];

    public static function boot()
    {
        parent::boot();
        static::updated(function ($item) {
            $item->order->evaluateStatus();
        });
        static::deleted(function ($item) {
            $item->order->evaluateStatus();
        });
    }

    public function order() { return $this->belongsTo(Order::class); }
    public function product() { return $this->belongsTo(Product::class); }
    public function variant() { return $this->belongsTo(ProductVariant::class); }
}