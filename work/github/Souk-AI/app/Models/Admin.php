<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'platform_commission_admin',
        'platform_commission_share',
    ];

    protected function casts(): array
    {
        return [
            'platform_commission_admin' => 'float',
            'platform_commission_share' => 'float',
        ];
    }

    /**
     * Get the user that owns the admin.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}