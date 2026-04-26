<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group'];

    protected static function booted(): void
    {
        static::saved(function (Setting $setting) {
            Cache::forget("setting.{$setting->key}");
            Cache::forget("settings.group.{$setting->group}");
        });

        static::deleted(function (Setting $setting) {
            Cache::forget("setting.{$setting->key}");
            Cache::forget("settings.group.{$setting->group}");
        });
    }
}
