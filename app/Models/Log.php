<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Log extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'userRole', 'title', 'description', 'status'];
    protected $casts = ['status' => 'boolean'];

    public function user() { return $this->belongsTo(User::class); }
}