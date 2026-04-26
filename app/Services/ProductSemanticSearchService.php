<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductSearchEmbedding;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Throwable;

class ProductSemanticSearchService
{
    public function __construct(
        private GeminiEmbeddingService $embeddingService
    ) {}

    public function isEnabled(): bool
    {
        return $this->embeddingService->isEnabled();
    }

    public function search(string $query, Builder $baseQuery): Collection
    {
        return $this->debugSearch($query, $baseQuery)
            ->pluck('product')
            ->values();
    }

    public function debugSearch(string $query, Builder $baseQuery): Collection
    {
        $query = trim($query);
        if ($query === '') return collect();

        try {
            // 1. Fetch products from DB
            $products = $baseQuery->with(['store', 'albums'])->get();
            if ($products->isEmpty()) return collect();

            $categoryMap = $this->buildCategoryMap($products);
            $tokens = $this->tokens($query);

            $queryEmbedding = [];
            $embeddings = collect();

            // 2. AI Logic
            if ($this->isEnabled()) {
                try {
                    $embeddings = $this->ensureEmbeddings($products, $categoryMap);
                    $queryEmbedding = $this->embeddingService->embedQuery($query);
                } catch (Throwable $aiException) {
                    // Report AI failure but allow keyword fallback
                    $this->safeReport($aiException);
                }
            }

            // 3. Scoring
            return $products
                ->map(function (Product $product) use ($embeddings, $queryEmbedding, $tokens, $categoryMap) {
                    $document = $this->buildSearchDocument($product, $categoryMap);
                    $keywordScore = $this->keywordScore($tokens, $document);
                    
                    $semanticScore = 0.0;
                    if (!empty($queryEmbedding)) {
                        $embeddingRow = $embeddings->get($product->id);
                        if ($embeddingRow && !empty($embeddingRow->embedding)) {
                            $semanticScore = $this->cosineSimilarity($queryEmbedding, $embeddingRow->embedding);
                        }
                    }

                    // Weighted Score
                    $score = !empty($queryEmbedding) 
                        ? ($semanticScore * 0.82) + ($keywordScore * 0.18)
                        : $keywordScore;

                    return [
                        'product' => $product,
                        'score' => $score,
                        'semantic_score' => $semanticScore,
                        'keyword_score' => $keywordScore,
                    ];
                })
                ->filter(fn ($row) => $row['score'] > 0.05)
                ->sortByDesc('score')
                ->values();

        } catch (Throwable $e) {
            // Crucial: Throwing the error so the Controller knows something went wrong
            $this->safeReport($e);
            throw $e; 
        }
    }

    /**
     * Reports an error but catches secondary errors (like Permission Denied on log files)
     */
    private function safeReport(Throwable $e)
    {
        try {
            report($e);
        } catch (Throwable $logFailure) {
            // If we can't log to file, we print to stderr for Docker logs
            error_log("Critical: Logging failed: " . $e->getMessage());
        }
    }

    private function ensureEmbeddings(Collection $products, Collection $categoryMap): Collection
    {
        $existing = ProductSearchEmbedding::whereIn('product_id', $products->pluck('id'))
            ->get()
            ->keyBy('product_id');

        $needsEmbedding = [];

        foreach ($products as $product) {
            $document = $this->buildSearchDocument($product, $categoryMap);
            $hash = sha1($document);
            $current = $existing->get($product->id);

            if (!$current || $current->content_hash !== $hash) {
                $needsEmbedding[] = [
                    'product_id' => $product->id,
                    'document' => $document,
                    'hash' => $hash,
                ];
            }
        }

        foreach (array_chunk($needsEmbedding, 50) as $chunk) {
            $vectors = $this->embeddingService->embedDocuments(array_column($chunk, 'document'));

            foreach ($chunk as $index => $item) {
                ProductSearchEmbedding::updateOrCreate(
                    ['product_id' => $item['product_id']],
                    [
                        'content_hash' => $item['hash'],
                        'model' => setting('gemini_embedding_model', config('services.gemini.embedding_model', 'models/gemini-embedding-001')),
                        'dimensions' => isset($vectors[$index]) ? count($vectors[$index]) : null,
                        'embedding' => $vectors[$index] ?? [],
                    ]
                );
            }
        }

        return ProductSearchEmbedding::whereIn('product_id', $products->pluck('id'))
            ->get()
            ->keyBy('product_id');
    }

    private function buildCategoryMap(Collection $products): Collection
    {
        $categoryIds = $products->pluck('categories')->flatten(1)->filter()->unique()->values();
        if ($categoryIds->isEmpty()) return collect();
        return Category::whereIn('id', $categoryIds)->get()->keyBy('id');
    }

    private function buildSearchDocument(Product $product, Collection $categoryMap): string
    {
        $categoryNames = collect($product->categories ?? [])
            ->map(fn ($id) => $categoryMap->get($id))
            ->filter()
            ->flatMap(fn ($category) => [$category->name_en, $category->name_fr, $category->name_ar])
            ->filter()
            ->all();

        $content = implode("\n", array_filter([
            $product->name_en, $product->name_fr, $product->name_ar,
            $product->description_en, $product->description_fr, $product->description_ar,
            implode(', ', $categoryNames),
        ]));

        return collect($this->textVariants($content))
            ->implode("\n");
    }

    private function normalizeText(string $text): string
    {
        return trim(Str::of($text)->squish()->lower()->value());
    }

    private function normalizeAsciiText(string $text): string
    {
        return $this->normalizeText(Str::ascii($text));
    }

    private function textVariants(string $text): array
    {
        return collect([
            $this->normalizeText($text),
            $this->normalizeAsciiText($text),
        ])
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function tokens(string $text): array
    {
        return collect($this->textVariants($text))
            ->flatMap(function (string $variant) {
                return preg_split('/[^\p{L}\p{N}]+/u', $variant) ?: [];
            })
            ->map(fn ($token) => trim($token))
            ->filter(fn ($token) => mb_strlen($token) >= 2)
            ->unique()
            ->values()
            ->all();
    }

    private function keywordScore(array $tokens, string $document): float
    {
        if (empty($tokens)) return 0.0;

        $documentTokens = $this->tokens($document);

        $score = collect($tokens)
            ->map(fn (string $token) => $this->tokenMatchScore($token, $document, $documentTokens))
            ->sum();

        return $score / max(count($tokens), 1);
    }

    private function tokenMatchScore(string $token, string $document, array $documentTokens): float
    {
        if (str_contains($document, $token)) {
            return 1.0;
        }

        $best = 0.0;

        foreach ($documentTokens as $documentToken) {
            $score = $this->fuzzyTokenSimilarity($token, $documentToken);

            if ($score > $best) {
                $best = $score;
            }

            if ($best >= 0.92) {
                break;
            }
        }

        return $best;
    }

    private function fuzzyTokenSimilarity(string $queryToken, string $documentToken): float
    {
        if ($queryToken === $documentToken) {
            return 1.0;
        }

        if (!$this->isAscii($queryToken) || !$this->isAscii($documentToken)) {
            return 0.0;
        }

        $queryLength = mb_strlen($queryToken);
        $documentLength = mb_strlen($documentToken);
        $maxLength = max($queryLength, $documentLength);

        if ($maxLength < 3 || abs($queryLength - $documentLength) > 2) {
            return 0.0;
        }

        $distance = levenshtein($queryToken, $documentToken);
        $similarity = 1 - ($distance / $maxLength);

        if ($distance === 1 && $maxLength >= 4) {
            return max($similarity, 0.88);
        }

        return $similarity >= 0.72 ? $similarity : 0.0;
    }

    private function isAscii(string $value): bool
    {
        return mb_check_encoding($value, 'ASCII');
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $dot = 0.0; $normA = 0.0; $normB = 0.0;
        $length = min(count($a), count($b));

        for ($i = 0; $i < $length; $i++) {
            $dot += $a[$i] * $b[$i];
            $normA += $a[$i] ** 2;
            $normB += $b[$i] ** 2;
        }

        return ($normA == 0.0 || $normB == 0.0) ? 0.0 : $dot / (sqrt($normA) * sqrt($normB));
    }
}
