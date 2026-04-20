<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model {
    use HasUuids;
    protected $fillable = ['order_number', 'client_id', 'influencer_id', 'status', 'totalAmount', 'driver_id'];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->order_number)) {
                $model->order_number = 'ORD-' . strtoupper(bin2hex(random_bytes(4)));
            }
        });
    }

    public function client() { return $this->belongsTo(Client::class); }
    public function influencer() { return $this->belongsTo(Influencer::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function factures() { return $this->hasMany(Facture::class); }
    public function driver() { return $this->belongsTo(ShippingEmp::class, 'driver_id'); }

    public function evaluateStatus()
    {
        $items = $this->items;
        if ($items->isEmpty()) return;

        // Condition: If ALL items are confirme, or at least one is confirmed and the rest are cancelled
        $allConfirmedOrCancelled = $items->every(fn($i) => in_array($i->status, ['confirme', 'annule']));
        $atLeastOneConfirmed = $items->where('status', 'confirme')->count() > 0;

        if ($allConfirmedOrCancelled && $atLeastOneConfirmed) {
            $this->update(['status' => 'confirme']);
        }
    }
}