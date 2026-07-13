<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PageImage extends Model
{
    protected $fillable = [
        'imageable_type',
        'imageable_id',
        'image_path',
        'sort_order',
    ];

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
