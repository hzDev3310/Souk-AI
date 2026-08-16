<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GeoZone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GeoZoneController extends Controller
{
    public function index()
    {
        $zones = GeoZone::orderBy('name_en')->get();
        return response()->json([
            'data' => $zones,
            'governorates' => $this->governoratesPayload(),
        ]);
    }

    /**
     * Lightweight options for store forms: active zones + all governorates with labels.
     */
    public function options()
    {
        $zones = GeoZone::where('isActive', true)->orderBy('name_en')->get()
            ->map(fn ($zone) => [
                'id' => $zone->id,
                'name' => $zone->getName(),
                'name_en' => $zone->name_en,
                'name_fr' => $zone->name_fr,
                'name_ar' => $zone->name_ar,
                'governorates' => $zone->governorates,
            ]);

        return response()->json([
            'zones' => $zones,
            'governorates' => $this->governoratesPayload(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_en' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'governorates' => 'required|array|min:1',
            'governorates.*' => 'required|in:' . implode(',', GeoZone::GOVERNORATES),
            'isActive' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $zone = GeoZone::create([
            'name_en' => $request->name_en,
            'name_fr' => $request->name_fr,
            'name_ar' => $request->name_ar,
            'governorates' => $request->governorates,
            'isActive' => $request->boolean('isActive', true),
        ]);

        return response()->json(['message' => 'Delivery zone created', 'data' => $zone], 201);
    }

    public function update(Request $request, $id)
    {
        $zone = GeoZone::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name_en' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'governorates' => 'required|array|min:1',
            'governorates.*' => 'required|in:' . implode(',', GeoZone::GOVERNORATES),
            'isActive' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $zone->update([
            'name_en' => $request->name_en,
            'name_fr' => $request->name_fr,
            'name_ar' => $request->name_ar,
            'governorates' => $request->governorates,
            'isActive' => $request->boolean('isActive', true),
        ]);

        return response()->json(['message' => 'Delivery zone updated', 'data' => $zone->fresh()]);
    }

    public function destroy($id)
    {
        $zone = GeoZone::findOrFail($id);
        $zone->delete();
        return response()->json(['message' => 'Delivery zone deleted']);
    }

    private function governoratesPayload(): array
    {
        return collect(GeoZone::GOVERNORATES)->map(fn ($code) => [
            'code' => $code,
            'label' => GeoZone::governorateLabel($code),
        ])->all();
    }
}