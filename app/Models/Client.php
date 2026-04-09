<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Client extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'address', 'city', 'codePostal', 'lon', 'lat'];

    public function user() { return $this->belongsTo(User::class); }
    public function orders() { return $this->hasMany(Order::class); }
}