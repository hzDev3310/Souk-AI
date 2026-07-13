<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'title_en', 'title_fr', 'title_ar',
        'subtitle_en', 'subtitle_fr', 'subtitle_ar',
        'content_en', 'content_fr', 'content_ar',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(PageImage::class, 'imageable_id')
            ->where('imageable_type', self::class);
    }

    public function getTitle(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        return $this->{"title_{$locale}"} ?? $this->title_en;
    }

    public function getSubtitle(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        return $this->{"subtitle_{$locale}"} ?? $this->subtitle_en;
    }

    public function getContent(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        return $this->{"content_{$locale}"} ?? $this->content_en;
    }

    public static function getBySlug(string $slug): ?self
    {
        return static::where('slug', $slug)->first();
    }
}
