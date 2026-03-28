<?php

namespace App\Models;

use App\Enums\FactureType;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasUuids;

    protected $fillable = [
        'order_id',
        'user_id',
        'facture_number',
        'type',
        'amount',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'type' => FactureType::class,
            'amount' => 'decimal:2',
            'status' => PaymentStatus::class,
        ];
    }

    /**
     * Get the order that owns the facture.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user that owns the facture.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}