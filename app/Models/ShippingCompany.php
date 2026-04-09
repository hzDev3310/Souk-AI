<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ShippingCompany extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'name', 'contactInfo', 'companyPhone', 'responsiblePhone', 'address', 'cin', 'matriculeFiscale', 'rib'];
    public function user() { return $this->belongsTo(User::class); }
}