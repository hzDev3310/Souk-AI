<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model {
    use HasUuids;
    protected $fillable = ['store_id', 'name_fr', 'name_ar', 'name_en', 'description_fr', 'description_ar', 'description_en', 'price', 'condition', 'stock', 'slug', 'promo', 'categories', 'isActive'];
    protected $casts = ['categories' => 'array', 'isActive' => 'boolean'];

    public function store() { return $this->belongsTo(Store::class); }
    public function variants() { return $this->hasMany(ProductVariant::class); }
    public function variantTree() {
        return $this->hasMany(ProductVariant::class)
            ->whereNotIn('id', function ($query) {
                $query->select('child_variant_id')->from('variant_links');
            })
            ->with('children');
    }
    public function albums() { return $this->hasMany(ProductAlbum::class); }
    public function categoryLinks() { return $this->belongsToMany(Category::class); } 
    public function searchEmbedding() { return $this->hasOne(ProductSearchEmbedding::class); }
}
