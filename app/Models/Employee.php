<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = ['name', 'shipping_company_id'];

    public function shippingCompany()
    {
        return $this->belongsTo(ShippingCompany::class);
    }
}