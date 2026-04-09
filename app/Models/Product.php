<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model {
    use HasUuids;
    protected $fillable = ['store_id', 'name_fr', 'name_ar', 'name_en', 'description_fr', 'description_ar', 'description_en', 'price', 'condition', 'stock', 'slug', 'promo', 'categories'];
    protected $casts = ['categories' => 'array'];

    public function store() { return $this->belongsTo(Store::class); }
    public function variants() { return $this->hasMany(ProductVariant::class); }
    public function albums() { return $this->hasMany(ProductAlbum::class); }
    public function categoryLinks() { return $this->belongsToMany(Category::class); } 
}