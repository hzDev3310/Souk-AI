<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    protected $fillable = [
        'email',
        'phone',
        'address_en', 'address_fr', 'address_ar',
        'map_embed_url',
    ];

    protected static ?self $instance = null;

    public static function instance(): self
    {
        if (!self::$instance) {
            self::$instance = static::firstOrCreate([], [
                'email' => 'support@soukai.com',
                'phone' => '+216 00 000 000',
                'address_en' => 'Tunis, Tunisia',
                'address_fr' => 'Tunis, Tunisie',
                'address_ar' => 'تونس، تونس',
            ]);
        }
        return self::$instance;
    }

    public function getAddress(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        return $this->{"address_{$locale}"} ?? $this->address_en;
    }
}
