<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Influencer extends Model
{
    protected $fillable = ['name', 'bio'];

    public function stores()
    {
        return $this->belongsToMany(Store::class);
    }
}