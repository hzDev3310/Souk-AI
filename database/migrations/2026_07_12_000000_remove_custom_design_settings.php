<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Setting::whereIn('key', [
            'primary_color',
            'secondary_color',
            'radius',
        ])->delete();
    }

    public function down(): void
    {
        Setting::updateOrCreate(['key' => 'primary_color'], [
            'value' => '#6366f1',
            'type' => 'color',
            'group' => 'design',
        ]);
        Setting::updateOrCreate(['key' => 'secondary_color'], [
            'value' => '#f43f5e',
            'type' => 'color',
            'group' => 'design',
        ]);
        Setting::updateOrCreate(['key' => 'radius'], [
            'value' => '28px',
            'type' => 'text',
            'group' => 'design',
        ]);
    }
};
