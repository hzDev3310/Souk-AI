<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Hero Section
            ['key' => 'hero_title_en', 'value' => 'Discover *Unique* Style', 'type' => 'text', 'group' => 'hero'],
            ['key' => 'hero_title_fr', 'value' => 'Découvrez un Style *Unique*', 'type' => 'text', 'group' => 'hero'],
            ['key' => 'hero_title_ar', 'value' => 'اكتشف أسلوباً *فريداً*', 'type' => 'text', 'group' => 'hero'],
            
            ['key' => 'hero_subtitle_en', 'value' => 'Shop the latest trends from the best creators and brands worldwide.', 'type' => 'text', 'group' => 'hero'],
            ['key' => 'hero_subtitle_fr', 'value' => 'Achetez les dernières tendances des meilleurs créateurs et marques mondiales.', 'type' => 'text', 'group' => 'hero'],
            ['key' => 'hero_subtitle_ar', 'value' => 'تسوق أحدث الصيحات من أفضل المبدعين والعلامات التجارية حول العالم.', 'type' => 'text', 'group' => 'hero'],
            
            ['key' => 'hero_image', 'value' => 'hero-banner.webp', 'type' => 'image', 'group' => 'hero'],
            
            // Design Tokens
            ['key' => 'primary_color', 'value' => '#6366f1', 'type' => 'color', 'group' => 'design'],
            ['key' => 'secondary_color', 'value' => '#f43f5e', 'type' => 'color', 'group' => 'design'],
            ['key' => 'radius', 'value' => '28px', 'type' => 'text', 'group' => 'design'],
            
            // Contact
            ['key' => 'contact_email', 'value' => 'support@soukai.com', 'type' => 'text', 'group' => 'general'],
            ['key' => 'website_name', 'value' => 'Souk AI', 'type' => 'text', 'group' => 'general'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
