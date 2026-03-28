<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name_fr',
        'name_ar',
        'name_en',
        'description_fr',
        'description_ar',
        'description_en',
        'responsible_name',
        'responsible_phone',
        'store_phone',
        'address',
        'responsible_cin',
        'matricule_fiscale',
        'logo',
        'rib',
        'is_active',
        'categories',
        'slug',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'categories' => 'json',
        ];
    }

    /**
     * Get the user that owns the store.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the products for the store.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}