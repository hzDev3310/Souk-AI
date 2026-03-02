<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Spatie\Translatable\HasTranslations;

class Product extends Model
{
    use HasTranslations;

    public $translatable = ['name', 'description'];

    protected $fillable = ['name', 'description', 'price', 'store_id'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}