<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

if (!function_exists('setting')) {
    function setting($key, $default = null)
    {
        return Cache::rememberForever("setting.{$key}", function () use ($key, $default) {
            $setting = Setting::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }
}

if (!function_exists('settings_group')) {
    function settings_group($group, $defaults = [])
    {
        return Cache::rememberForever("settings.group.{$group}", function () use ($group, $defaults) {
            $settings = Setting::where('group', $group)->get();
            $result = $defaults;
            foreach ($settings as $setting) {
                $result[$setting->key] = $setting->value;
            }
            return $result;
        });
    }
}
