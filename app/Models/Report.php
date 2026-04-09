<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Report extends Model {
    use HasUuids;
    protected $fillable = ['reporterId', 'reportedTargetId', 'reportedTargetRole', 'description', 'status'];
}