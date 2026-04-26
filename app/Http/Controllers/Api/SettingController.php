<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Setting;

class SettingController extends Controller
{
    public function index()
    {
        collect([
            ['key' => 'website_logo', 'value' => null, 'type' => 'image', 'group' => 'branding'],
            ['key' => 'gemini_api_key', 'value' => null, 'type' => 'password', 'group' => 'ai'],
            ['key' => 'gemini_embedding_model', 'value' => 'models/gemini-embedding-001', 'type' => 'select', 'group' => 'ai'],
        ])->each(function (array $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        });

        return response()->json(Setting::all());
    }

    public function update(Request $request, string $id)
    {
        $setting = Setting::findOrFail($id);
        $setting->update($request->only('value'));
        return response()->json($setting);
    }

    public function bulkUpdate(Request $request)
    {
        $settings = $request->input('settings', []);
        foreach ($settings as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }
        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('settings', 'public');
            return response()->json(['path' => $path]);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
