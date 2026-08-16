<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\GeoZone;

return new class extends Migration
{
    /**
     * Admin-managed delivery zones.
     *
     * A zone is a graphical grouping of Tunisian governorates (e.g. zone
     * "Tunis" = Tunis + Ariana + Ben Arous + Manouba). Stores are located in
     * a governorate and their delivery zone is derived from the zone that
     * contains that governorate. The admin can add/remove zones and toggle
     * which ones are active (accepting stores).
     *
     * On first launch only the "Tunis" and "Sousse" zones are seeded, so only
     * stores in their governorates can be accepted; more zones can be added
     * later by the admin.
     */
    public function up(): void
    {
        Schema::create('geo_zones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name_en');
            $table->string('name_fr');
            $table->string('name_ar');
            $table->json('governorates');
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });

        $zones = [
            [
                'name_en' => 'Tunis',
                'name_fr' => 'Tunis',
                'name_ar' => 'تونس',
                'governorates' => ['TUNIS', 'ARIANA', 'BEN_AROUS', 'MANOUBA'],
            ],
            [
                'name_en' => 'Sousse',
                'name_fr' => 'Sousse',
                'name_ar' => 'سوسة',
                'governorates' => ['KAIROUAN', 'SOUSSE', 'MONASTIR', 'MAHDIA'],
            ],
        ];

        foreach ($zones as $zone) {
            GeoZone::create($zone);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('geo_zones');
    }
};