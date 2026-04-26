<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'gemini_api_key', 'value' => null, 'type' => 'password', 'group' => 'ai'],
            ['key' => 'gemini_embedding_model', 'value' => 'models/gemini-embedding-001', 'type' => 'select', 'group' => 'ai'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }

    public function down(): void
    {
        Setting::whereIn('key', [
            'gemini_api_key',
            'gemini_embedding_model',
        ])->delete();
    }
};
