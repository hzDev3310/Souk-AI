<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasUuids;

    protected $fillable = [
        'reporter_id',
        'reported_user_id',
        'reported_product_id',
        'description',
        'status',
    ];

    /**
     * Get the reporter user.
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Get the reported user.
     */
    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    /**
     * Get the reported product.
     */
    public function reportedProduct()
    {
        return $this->belongsTo(Product::class, 'reported_product_id');
    }
}