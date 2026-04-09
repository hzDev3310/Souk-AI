<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Admin extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'platformCommissionAdmin', 'platformCommissionShare'];
    public function user() { return $this->belongsTo(User::class); }
}