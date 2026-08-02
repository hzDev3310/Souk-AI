<?php

if (!function_exists('image_url')) {
    function image_url($path, $fallback = '/storage/empty/empty.webp')
    {
        if (!$path) {
            return $fallback;
        }

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return '/storage/' . ltrim($path, '/');
    }
}
