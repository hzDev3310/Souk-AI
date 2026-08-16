<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Store extends Model {
    use HasUuids;

    protected $fillable = ['user_id', 'name_fr', 'name_ar', 'name_en', 'description_fr', 'description_ar', 'description_en', 'storePhone', 'address', 'responsibleCin', 'matriculeFiscale', 'logo', 'cover', 'rib', 'isActive', 'categories', 'slug', 'promo', 'governorate'];
    protected $casts = ['isActive' => 'boolean', 'categories' => 'array'];

    public function user() { return $this->belongsTo(User::class); }
    public function products() { return $this->hasMany(Product::class); }

    /**
     * The delivery zone covering the store's governorate (derived, not stored).
     */
    public function zone(): ?GeoZone
    {
        return GeoZone::zoneForGovernorate($this->governorate);
    }

    public function zoneLabel(): string
    {
        $zone = $this->zone();
        return $zone ? $zone->getName() : __('website.zones.unassigned');
    }

    public function governorateLabel(): string
    {
        return GeoZone::governorateLabel($this->governorate);
    }
}