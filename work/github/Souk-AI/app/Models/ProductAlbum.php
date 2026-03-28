<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProductAlbum extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'image_url',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    /**
     * Get the product that owns the album.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}