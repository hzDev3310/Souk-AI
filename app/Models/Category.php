<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Category extends Model {
    use HasUuids;
    protected $fillable = ['parent_id', 'name_fr', 'name_ar', 'name_en', 'slug', 'icon', 'logo', 'cover', 'isActive'];
    protected $casts = ['isActive' => 'boolean'];

    public function parent() { return $this->belongsTo(Category::class, 'parent_id'); }
    public function children() { return $this->hasMany(Category::class, 'parent_id'); }
    public function products() { return $this->belongsToMany(Product::class); }
}