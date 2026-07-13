<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GrokTranslationService
{
    private function apiKey(): ?string
    {
        return setting('grok_api_key') ?: config('services.grok.api_key');
    }

    private function baseUrl(): string
    {
        return setting('grok_base_url') ?: config('services.grok.base_url', 'https://api.groq.com/openai/v1/chat/completions');
    }

    private function model(): string
    {
        return setting('grok_model') ?: config('services.grok.model', 'llama-3.3-70b-versatile');
    }

    private function visionModel(): string
    {
        return setting('grok_vision_model') ?: config('services.grok.vision_model', 'llama-3.2-90b-vision-preview');
    }

    public function isEnabled(): bool
    {
        return filled($this->apiKey());
    }

    public function fillMissingTranslations(array $data): array
    {
        if (!$this->isEnabled()) {
            throw new RuntimeException('Grok API key is not configured.');
        }

        $baseUrl = rtrim($this->baseUrl(), '/');
        $model = $this->model();

        $prompt = "You are a professional translator. I will provide a JSON object representing fields in different languages (English, French, Arabic, etc.). Some fields have content and some are empty strings. Your task is to accurately translate the content from the filled fields into the appropriate language for the empty fields. Return ONLY a valid JSON object with the exact same keys as the input, where all missing translations have been filled. Do not include markdown formatting like ```json or any other text.\n\nInput JSON:\n" . json_encode($data, JSON_UNESCAPED_UNICODE);

        try {
            $response = Http::timeout(45)
                ->withToken($this->apiKey())
                ->post($baseUrl, [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'temperature' => 0.1,
                    'response_format' => [
                        'type' => 'json_object',
                    ],
                ])
                ->throw()
                ->json();

            $responseText = $response['choices'][0]['message']['content'] ?? '';

            // Clean up potential markdown formatting if the model ignored the prompt instruction
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
                return array_merge($data, $translatedData);
            }

            Log::error('Grok translation returned invalid JSON', ['response' => $responseText]);
            return $data;
        } catch (\Exception $e) {
            Log::error('Grok translation failed', ['error' => $e->getMessage()]);
            throw new RuntimeException('Failed to auto-translate: ' . $e->getMessage());
        }
    }

    public function reformatDescription(string $description, array $images): string
    {
        if (!$this->isEnabled()) {
            throw new RuntimeException('Grok API key is not configured.');
        }

        if (empty($images)) {
            throw new RuntimeException('At least one product image is required.');
        }

        $baseUrl = rtrim($this->baseUrl(), '/');
        $model = $this->visionModel();

        $systemPrompt = 'You are a professional copywriter for an e-commerce marketplace. Your task is to correct grammar and spelling errors, reformulate, and improve the given product description based on the product images provided. Make the description compelling, accurate, and well-structured. Return ONLY the corrected and reformulated description text in the same language as the input, without any additional commentary or formatting.';

        $content = [
            [
                'type' => 'text',
                'text' => "Product description to correct and reformulate:\n\n{$description}",
            ],
        ];

        foreach ($images as $imageData) {
            $content[] = [
                'type' => 'image_url',
                'image_url' => [
                    'url' => "data:image/jpeg;base64,{$imageData}",
                ],
            ];
        }

        try {
            $response = Http::timeout(60)
                ->withToken($this->apiKey())
                ->post($baseUrl, [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt,
                        ],
                        [
                            'role' => 'user',
                            'content' => $content,
                        ],
                    ],
                    'temperature' => 0.2,
                    'max_tokens' => 1024,
                ])
                ->throw()
                ->json();

            $responseText = $response['choices'][0]['message']['content'] ?? '';

            return trim($responseText);
        } catch (\Exception $e) {
            Log::error('Grok description reformat failed', ['error' => $e->getMessage()]);
            throw new RuntimeException('Failed to reformat description: ' . $e->getMessage());
        }
    }
}
