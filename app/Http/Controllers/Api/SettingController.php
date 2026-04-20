<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Setting;

class SettingController extends Controller
{
    public function index()
    {
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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('settings', 'public');
            return response()->json(['path' => $path]);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
