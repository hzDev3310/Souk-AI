<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Notification extends Model {
    use HasUuids;
    protected $fillable = ['targetType', 'targetId', 'title', 'message', 'isSeen'];
    protected $casts = ['isSeen' => 'boolean'];
}