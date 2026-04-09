<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;

class TranslationsController extends Controller
{
    public function index($locale)
    {
        $path = base_path("lang/{$locale}.json");
        
        if (File::exists($path)) {
            return response()->json(json_decode(File::get($path), true));
        }

        return response()->json([]);
    }
}
