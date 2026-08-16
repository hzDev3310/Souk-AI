<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class GeoZone extends Model {
    use HasUuids;

    const GOVERNORATES = [
        'TUNIS', 'ARIANA', 'BEN_AROUS', 'MANOUBA',
        'NABEUL', 'ZAGHOUAN', 'BIZERTE', 'BEJA',
        'JENDOUBA', 'KEF', 'SILIANA', 'SOUSSE',
        'MONASTIR', 'MAHDIA', 'SFAX', 'KAIROUAN',
        'KASSERINE', 'SIDI_BOUZID', 'GABES', 'MEDENINE',
        'TATAOUINE', 'GAFSA', 'TOZEUR', 'KEBILI',
    ];

    protected $fillable = ['name_en', 'name_fr', 'name_ar', 'governorates', 'isActive'];
    protected $casts = ['governorates' => 'array', 'isActive' => 'boolean'];

    public function getName(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        $name = $this->{'name_' . $locale} ?? null;
        return $name ?: ($this->name_en ?: $this->name_fr ?: $this->name_ar);
    }

    public static function governorateLabel(?string $governorate): string
    {
        if (!$governorate) return '';
        $key = 'website.governorates.' . $governorate;
        $translated = __($key);
        return ($translated === $key) ? $governorate : $translated;
    }

    /**
     * Active zones indexed by governorate code (cached for the request).
     */
    public static function zoneMap(): array
    {
        static $map = null;
        if ($map === null) {
            $map = [];
            foreach (self::where('isActive', true)->get() as $zone) {
                foreach ($zone->governorates as $gov) {
                    $map[$gov] = $zone;
                }
            }
        }
        return $map;
    }

    /**
     * Resolve the active zone that covers a governorate, if any.
     */
    public static function zoneForGovernorate(?string $governorate): ?self
    {
        if (!$governorate) return null;
        return self::zoneMap()[$governorate] ?? null;
    }
}