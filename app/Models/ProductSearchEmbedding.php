<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSearchEmbedding extends Model
{
    protected $fillable = [
        'product_id',
        'content_hash',
        'model',
        'dimensions',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
