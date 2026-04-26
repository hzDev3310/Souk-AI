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
    ) {
    }

    public function isEnabled(): bool
    {
        return $this->embeddingService->isEnabled();
    }

    /**
     * Performs a semantic search by comparing the query's vector embedding against product embeddings.
     */
    public function search(string $query, Builder $baseQuery): Collection
    {
        return $this->debugSearch($query, $baseQuery)
            ->pluck('product')
            ->values();
    }

    public function debugSearch(string $query, Builder $baseQuery): Collection
    {
        $query = trim($query);

        if ($query === '') {
            return collect();
        }

        try {
            $products = $baseQuery
                ->with(['store', 'albums'])
                ->get();

            if ($products->isEmpty()) {
                return collect();
            }

            $categoryMap = $this->buildCategoryMap($products);
            $tokens = $this->tokens($query);

            $queryEmbedding = [];
            $embeddings = collect();

            // Try to use AI if enabled
            if ($this->isEnabled()) {
                try {
                    $embeddings = $this->ensureEmbeddings($products, $categoryMap);
                    $queryEmbedding = $this->embeddingService->embedQuery($this->normalizeText($query));
                } catch (Throwable $e) {
                    report($e);
                    // Continue with keyword search fallback
                }
            }

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

                    // Score calculation: 
                    // If AI worked, use weighted average (82% semantic, 18% keyword)
                    // If AI failed or is off, use 100% keyword score
                    if (!empty($queryEmbedding)) {
                        $score = ($semanticScore * 0.82) + ($keywordScore * 0.18);
                    } else {
                        $score = $keywordScore;
                    }

                    return [
                        'product' => $product,
                        'score' => $score,
                        'semantic_score' => $semanticScore,
                        'keyword_score' => $keywordScore,
                    ];
                })
                ->filter(fn ($row) => $row && $row['score'] > 0.05) // Lower threshold for keyword matches
                ->sortByDesc('score')
                ->values();
        } catch (Throwable $e) {
            report($e);
            return collect();
        }
    }

    /**
     * Ensures all products in the collection have up-to-date vector embeddings.
     * If a product's content has changed (checked via hash), it generates new embeddings via the Gemini API.
     */
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
        $categoryIds = $products
            ->pluck('categories')
            ->flatten(1)
            ->filter()
            ->unique()
            ->values();

        if ($categoryIds->isEmpty()) {
            return collect();
        }

        return Category::whereIn('id', $categoryIds)
            ->get()
            ->keyBy('id');
    }

    /**
     * Constructs a single text document containing all relevant product information 
     * (names, descriptions, and categories across multiple languages) to be vectorized.
     */
    private function buildSearchDocument(Product $product, Collection $categoryMap): string
    {
        $categoryNames = collect($product->categories ?? [])
            ->map(fn ($id) => $categoryMap->get($id))
            ->filter()
            ->flatMap(fn ($category) => [
                $category->name_en,
                $category->name_fr,
                $category->name_ar,
            ])
            ->filter()
            ->all();

        return $this->normalizeText(implode("\n", array_filter([
            $product->name_en,
            $product->name_fr,
            $product->name_ar,
            $product->description_en,
            $product->description_fr,
            $product->description_ar,
            implode(', ', $categoryNames),
        ])));
    }

    private function normalizeText(string $text): string
    {
        return trim(Str::of($text)->squish()->lower()->value());
    }

    private function tokens(string $text): array
    {
        return collect(preg_split('/[^\p{L}\p{N}]+/u', $this->normalizeText($text)) ?: [])
            ->filter(fn ($token) => mb_strlen($token) >= 3)
            ->unique()
            ->values()
            ->all();
    }

    private function keywordScore(array $tokens, string $document): float
    {
        if (empty($tokens)) {
            return 0.0;
        }

        $matches = collect($tokens)->filter(fn ($token) => str_contains($document, $token))->count();

        return $matches / max(count($tokens), 1);
    }

    /**
     * Calculates the cosine similarity between two vectors.
     * This measures the mathematical angle between the query vector and the product vector,
     * which represents their semantic closeness.
     */
    private function cosineSimilarity(array $a, array $b): float
    {
        $dot = 0.0;
        $normA = 0.0;
        $normB = 0.0;
        $length = min(count($a), count($b));

        for ($i = 0; $i < $length; $i++) {
            $dot += $a[$i] * $b[$i];
            $normA += $a[$i] ** 2;
            $normB += $b[$i] ** 2;
        }

        if ($normA == 0.0 || $normB == 0.0) {
            return 0.0;
        }

        return $dot / (sqrt($normA) * sqrt($normB));
    }
}
