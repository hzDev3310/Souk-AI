<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductVariant extends Model {
    use HasUuids;

    protected $fillable = [
        'product_id',
        'variant_name',
        'attribute_name',
        'attribute_value',
        'option_value',
        'sku',
        'price',
        'price_override',
        'stock',
        'stock_quantity',
    ];

    protected $casts = [
        'price_override' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    public function product() { return $this->belongsTo(Product::class); }

    /**
     * Sub-options under this node (many-to-many via variant_links).
     */
    public function children() {
        return $this->belongsToMany(self::class, 'variant_links', 'parent_variant_id', 'child_variant_id')
            ->withTimestamps()
            ->orderBy('attribute_value');
    }

    /**
     * Parents this option is attached under (many-to-many via variant_links).
     */
    public function parents() {
        return $this->belongsToMany(self::class, 'variant_links', 'child_variant_id', 'parent_variant_id')
            ->withTimestamps();
    }

    public function albums() {
        return $this->belongsToMany(ProductAlbum::class, 'variant_images', 'variant_id', 'image_id')
            ->withPivot('display_order')
            ->orderBy('variant_images.display_order');
    }

    /**
     * Option swatch value ready for the UI: hex colors pass through unchanged,
     * stored images are turned into public URLs.
     */
    public function optionValueUrl(): ?string
    {
        $value = $this->attributes['option_value'] ?? null;
        if ($value === null || $value === '') {
            return null;
        }
        if (str_starts_with($value, '#') || str_starts_with($value, 'http') || str_starts_with($value, '/storage/')) {
            return $value;
        }
        return '/storage/' . ltrim($value, '/');
    }

    /**
     * Legacy compatibility: `price` reads/writes the new `price_override` column
     * so existing code (order snapshots, older serializations) keeps working.
     */
    public function getPriceAttribute() {
        return $this->attributes['price_override'] ?? $this->attributes['price'] ?? null;
    }

    public function setPriceAttribute($value) {
        $this->attributes['price_override'] = $value;
    }

    public function getStockAttribute() {
        return $this->attributes['stock_quantity'] ?? $this->attributes['stock'] ?? 0;
    }

    public function setStockAttribute($value) {
        $this->attributes['stock_quantity'] = $value;
    }
}
