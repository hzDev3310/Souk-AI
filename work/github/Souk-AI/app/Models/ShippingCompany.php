<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ShippingCompany extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'rib',
        'responsible_name',
        'responsible_phone',
        'company_phone',
        'address',
        'cin',
        'matricule_fiscale',
    ];

    /**
     * Get the user that owns the shipping company.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the shipping employees for the company.
     */
    public function employees()
    {
        return $this->hasMany(ShippingEmployee::class);
    }

    /**
     * Get the orders for the shipping company.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}