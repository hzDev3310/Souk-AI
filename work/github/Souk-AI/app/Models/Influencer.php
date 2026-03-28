<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Influencer extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'user_name',
        'referral_code',
        'commission_rate',
        'profile_picture',
        'phone',
        'address',
        'cin',
        'rib',
        'is_active',
        'slug',
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'float',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the influencer.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the products for the influencer.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}