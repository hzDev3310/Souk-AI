<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TranslationsController extends Controller
{
    public function index($locale)
    {
        $path = base_path("lang/{$locale}.json");

        if (!file_exists($path)) {
            return response()->json([], 404);
        }

        $translations = json_decode(file_get_contents($path), true);

        return response()->json($translations);
    }
}