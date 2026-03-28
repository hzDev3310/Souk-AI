<?php

namespace App\Models;

use App\Enums\ProductCondition;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'store_id',
        'influencer_id',
        'name_fr',
        'name_ar',
        'name_en',
        'description_fr',
        'description_ar',
        'description_en',
        'price',
        'condition',
        'stock',
        'slug',
        'promo',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'promo' => 'decimal:2',
            'stock' => 'integer',
            'condition' => ProductCondition::class,
        ];
    }

    /**
     * Get the store that owns the product.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the influencer that owns the product.
     */
    public function influencer()
    {
        return $this->belongsTo(Influencer::class);
    }

    /**
     * Get the product albums.
     */
    public function albums()
    {
        return $this->hasMany(ProductAlbum::class);
    }

    /**
     * Get the product variations.
     */
    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}