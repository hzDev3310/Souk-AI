<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'grok_api_key', 'value' => null, 'type' => 'password', 'group' => 'ai'],
            ['key' => 'grok_base_url', 'value' => 'https://api.groq.com/openai/v1/chat/completions', 'type' => 'text', 'group' => 'ai'],
            ['key' => 'grok_model', 'value' => 'llama-3.3-70b-versatile', 'type' => 'text', 'group' => 'ai'],
            ['key' => 'grok_vision_model', 'value' => 'llama-3.2-90b-vision-preview', 'type' => 'text', 'group' => 'ai'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }

    public function down(): void
    {
        Setting::whereIn('key', [
            'grok_api_key',
            'grok_base_url',
            'grok_model',
            'grok_vision_model',
        ])->delete();
    }
};
