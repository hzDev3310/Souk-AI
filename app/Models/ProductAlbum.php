<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductAlbum extends Model {
    use HasUuids;
    protected $fillable = ['product_id', 'imageUrl', 'isPrimary'];
    protected $casts = ['isPrimary' => 'boolean'];
    public function product() { return $this->belongsTo(Product::class); }
}