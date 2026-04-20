<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StoreProfileController extends Controller
{
    /**
     * Get the current authenticated store's profile
     */
    public function profile(Request $request)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $store
        ]);
    }

    /**
     * Update the store profile
     */
    public function updateProfile(Request $request)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        // Validate input
        $validator = Validator::make($request->all(), [
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_fr' => 'required|string',
            'description_ar' => 'required|string',
            'description_en' => 'required|string',
            'storePhone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'responsibleCin' => 'required|string|max:50',
            'matriculeFiscale' => 'required|string|max:50',
            'rib' => 'required|string|max:100',
            'promo' => 'required|numeric|min:0|max:100',
            'logo' => 'nullable|image|mimes:jpeg,png,gif,webp|max:2048',
            'cover' => 'nullable|image|mimes:jpeg,png,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except(['logo', 'cover']);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($store->logo && Storage::exists('public/' . $store->logo)) {
                Storage::delete('public/' . $store->logo);
            }
            $logoPath = $request->file('logo')->store('store_logos', 'public');
            $data['logo'] = $logoPath;
        }

        // Handle cover upload
        if ($request->hasFile('cover')) {
            // Delete old cover if exists
            if ($store->cover && Storage::exists('public/' . $store->cover)) {
                Storage::delete('public/' . $store->cover);
            }
            $coverPath = $request->file('cover')->store('store_covers', 'public');
            $data['cover'] = $coverPath;
        }

        // Update store
        $store->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Store profile updated successfully',
            'data' => $store->fresh()
        ]);
    }
}
