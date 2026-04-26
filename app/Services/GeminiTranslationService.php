<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiTranslationService
{
    private function apiKey(): ?string
    {
        return setting('gemini_api_key') ?: config('services.gemini.api_key');
    }

    private function baseUrl(): string
    {
        return setting('gemini_base_url') ?: config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
    }

    private function model(): string
    {
        // For text generation, flash is fast and cheap.
        return 'models/gemini-1.5-flash';
    }

    public function isEnabled(): bool
    {
        return filled($this->apiKey());
    }

    /**
     * Takes an associative array of fields and their values (some empty) 
     * and uses Gemini to fill in the missing translations.
     */
    public function fillMissingTranslations(array $data): array
    {
        if (!$this->isEnabled()) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $baseUrl = rtrim($this->baseUrl(), '/');
        $model = $this->model();

        $prompt = "You are a professional translator. I will provide a JSON object representing fields in different languages (English, French, Arabic, etc.). Some fields have content and some are empty strings. Your task is to accurately translate the content from the filled fields into the appropriate language for the empty fields. Return ONLY a valid JSON object with the exact same keys as the input, where all missing translations have been filled. Do not include markdown formatting like ```json or any other text.\n\nInput JSON:\n" . json_encode($data, JSON_UNESCAPED_UNICODE);

        try {
            $response = Http::timeout(45)
                ->withQueryParameters([
                    'key' => $this->apiKey(),
                ])
                ->post("{$baseUrl}/{$model}:generateContent", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.1,
                        'responseMimeType' => 'application/json',
                    ]
                ])
                ->throw()
                ->json();

            $responseText = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            // Clean up potential markdown formatting if Gemini ignored the prompt instruction
            $responseText = trim($responseText);
            if (str_starts_with($responseText, '```json')) {
                $responseText = substr($responseText, 7);
            }
            if (str_starts_with($responseText, '```')) {
                $responseText = substr($responseText, 3);
            }
            if (str_ends_with($responseText, '```')) {
                $responseText = substr($responseText, 0, -3);
            }
            
            $translatedData = json_decode(trim($responseText), true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($translatedData)) {
                return array_merge($data, $translatedData); // Ensure original keys remain
            }

            Log::error('Gemini translation returned invalid JSON', ['response' => $responseText]);
            return $data; // Return original if parsing fails
        } catch (\Exception $e) {
            Log::error('Gemini translation failed', ['error' => $e->getMessage()]);
            throw new RuntimeException('Failed to auto-translate: ' . $e->getMessage());
        }
    }
}
