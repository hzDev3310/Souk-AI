<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Comment extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'targetRole', 'targetId', 'content'];
    public function user() { return $this->belongsTo(User::class); }
}