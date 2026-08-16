<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\VariantTreeService;
use Illuminate\Http\Request;

class PublicVariantController extends Controller
{
    public function __construct(private VariantTreeService $treeService)
    {
    }

    /**
     * Public nested variant tree for the storefront selector.
     */
    public function tree(Product $product)
    {
        return response()->json($this->treeService->treeFor($product));
    }

    /**
     * Reverse lookup for a selected leaf. Accepts an optional ordered `path_ids`
     * array (root -> ... -> leaf) so multi-parent chains resolve correctly.
     * Returns the options path plus resolved price/stock and images.
     */
    public function resolve(Request $request, ProductVariant $variant)
    {
        $product = $variant->product;

        $pathIds = $request->input('path_ids');
        $path = is_array($pathIds) && count($pathIds) > 1
            ? $this->treeService->resolvePath($product, array_values($pathIds))
            : $this->fallbackPath($variant);

        if ($path === null) {
            $path = $this->fallbackPath($variant);
        }

        $albums = $variant->albums->isNotEmpty() ? $variant->albums : $product->albums;

        return response()->json([
            'variant' => $variant->only(['id', 'attribute_name', 'attribute_value', 'sku', 'stock_quantity']),
            'path' => $path,
            'stock_quantity' => $variant->stock_quantity,
            'option_value' => $variant->optionValueUrl(),
            'product_price' => $product->price,
            'product_promo' => $product->promo,
            'albums' => $albums,
        ]);
    }

    private function fallbackPath(ProductVariant $variant): array
    {
        $path = [];
        $node = $variant;
        $seen = [];

        while ($node instanceof ProductVariant) {
            if (isset($seen[$node->id])) {
                break;
            }
            $seen[$node->id] = true;
            array_unshift($path, [
                'id' => $node->id,
                'attribute_name' => $node->attribute_name,
                'attribute_value' => $node->attribute_value ?: $node->variant_name,
                'sku' => $node->sku,
            ]);
            $node = $node->parents()->first();
        }

        return $path;
    }
}
