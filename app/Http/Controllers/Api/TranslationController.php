<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeminiTranslationService;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    public function autoFill(Request $request, GeminiTranslationService $translationService)
    {
        $request->validate([
            'fields' => 'required|array',
        ]);

        if (!$translationService->isEnabled()) {
            return response()->json(['error' => 'Translation service is not configured.'], 503);
        }

        try {
            $translatedData = $translationService->fillMissingTranslations($request->input('fields'));
            return response()->json([
                'success' => true,
                'data' => $translatedData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
