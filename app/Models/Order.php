<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model {
    use HasUuids;
    protected $fillable = ['client_id', 'influencer_id', 'status', 'totalAmount'];

    public function client() { return $this->belongsTo(Client::class); }
    public function influencer() { return $this->belongsTo(Influencer::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function factures() { return $this->hasMany(Facture::class); }
}