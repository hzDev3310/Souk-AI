<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductSemanticSearchService;
use Illuminate\Http\Request;

class PublicSemanticSearchController extends Controller
{
    public function __construct(
        private ProductSemanticSearchService $semanticSearchService
    ) {
    }

    public function __invoke(Request $request)
    {
        $query = trim((string) $request->input('q', ''));
        $minPrice = (float) $request->input('min_price', 0);
        $maxPrice = (float) $request->input('max_price', 999999);
        $categoryId = $request->input('category_id');
        $limit = min(max((int) $request->input('limit', 10), 1), 50);

        $baseQuery = Product::query()
            ->whereHas('store', function ($query) {
                $query->where('isActive', true)
                    ->whereHas('user', function ($userQuery) {
                        $userQuery->where('isBlocked', false);
                    });
            })
            ->whereBetween('price', [$minPrice, $maxPrice]);

        if ($categoryId) {
            $baseQuery->whereJsonContains('categories', $categoryId);
        }

        if ($query === '') {
            return response()->json([
                'success' => false,
                'message' => 'The q parameter is required.',
            ], 422);
        }

        $results = $this->semanticSearchService->debugSearch($query, clone $baseQuery)
            ->take($limit)
            ->map(function (array $row) {
                /** @var \App\Models\Product $product */
                $product = $row['product'];

                return [
                    'id' => $product->id,
                    'slug' => $product->slug,
                    'name_en' => $product->name_en,
                    'name_fr' => $product->name_fr,
                    'name_ar' => $product->name_ar,
                    'store' => [
                        'id' => $product->store?->id,
                        'name_en' => $product->store?->name_en,
                        'name_fr' => $product->store?->name_fr,
                        'name_ar' => $product->store?->name_ar,
                    ],
                    'score' => round($row['score'], 6),
                    'semantic_score' => round($row['semantic_score'], 6),
                    'keyword_score' => round($row['keyword_score'], 6),
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'query' => $query,
            'ai_enabled' => $this->semanticSearchService->isEnabled(),
            'result_count' => $results->count(),
            'results' => $results,
        ]);
    }
}
