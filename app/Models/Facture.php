<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Facture extends Model {
    use HasUuids;
    protected $fillable = ['order_id', 'factureNumber', 'type', 'amount', 'status'];
    public function order() { return $this->belongsTo(Order::class); }
}