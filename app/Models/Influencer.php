<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Influencer extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'referralCode', 'commissionRate', 'profilePicture', 'phone', 'address', 'city', 'codePostal', 'cin', 'rib', 'd17', 'isActive', 'slug'];
    protected $casts = ['isActive' => 'boolean'];

    public function user() { return $this->belongsTo(User::class); }
    public function orders() { return $this->hasMany(Order::class); }
}