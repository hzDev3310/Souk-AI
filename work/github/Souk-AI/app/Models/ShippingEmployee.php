<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ShippingEmployee extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'shipping_company_id',
        'full_name',
        'phone',
        'cin',
        'is_available',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the shipping employee.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the shipping company that owns the employee.
     */
    public function shippingCompany()
    {
        return $this->belongsTo(ShippingCompany::class);
    }

    /**
     * Get the orders assigned to the employee.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}