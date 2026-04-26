<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiEmbeddingService
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
        return setting('gemini_embedding_model') ?: config('services.gemini.embedding_model', 'models/gemini-embedding-001');
    }

    public function isEnabled(): bool
    {
        return filled($this->apiKey());
    }

    public function embedDocuments(array $inputs): array
    {
        return $this->embed($inputs, 'RETRIEVAL_DOCUMENT');
    }

    public function embedQuery(string $input): array
    {
        return $this->embed([$input], 'RETRIEVAL_QUERY')[0] ?? [];
    }

    private function embed(array $inputs, string $taskType): array
    {
        if (!$this->isEnabled()) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $baseUrl = rtrim($this->baseUrl(), '/');
        $model = $this->model();
        $vectors = [];

        foreach ($inputs as $input) {
            $response = Http::timeout(45)
                ->withQueryParameters([
                    'key' => $this->apiKey(),
                ])
                ->post("{$baseUrl}/{$model}:embedContent", [
                    'model' => $model,
                    'content' => [
                        'parts' => [
                            ['text' => $input],
                        ],
                    ],
                    'taskType' => $taskType,
                ])
                ->throw()
                ->json();

            $vectors[] = $response['embedding']['values'] ?? [];
        }

        return $vectors;
    }
}
