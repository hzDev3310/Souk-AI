<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductAlbum;
use App\Models\ProductVariant;
use App\Services\VariantTreeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductVariantController extends Controller
{
    public function __construct(private VariantTreeService $treeService)
    {
    }

    /**
     * Full nested variant tree for a product (roots -> children -> ...).
     */
    public function tree(Product $product)
    {
        return response()->json($this->treeService->treeFor($product));
    }

    /**
     * Flat list of every variant node of the product, used by the searchable
     * multi-parent picker when creating/linking a child option.
     */
    public function options(Product $product)
    {
        $nodes = $product->variants()->with('parents')->get()->map(function ($v) {
            return [
                'id' => $v->id,
                'attribute_name' => $v->attribute_name,
                'attribute_value' => $v->attribute_value ?: $v->variant_name,
                'sku' => $v->sku,
                'price_override' => $v->price_override,
                'stock_quantity' => (int) $v->stock_quantity,
                'parent_ids' => $v->parents->pluck('id'),
                'albums' => $v->albums->map(fn ($a) => ['id' => $a->id, 'file' => $a->file]),
            ];
        });

        return response()->json($nodes);
    }

    /**
     * Insert a variant node. `parent_ids` may contain zero to many parents:
     *   []        -> top-level option (root)
     *   [p1, p2]  -> linked under both p1 and p2 (shared sub-option)
     */
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'attribute_name' => 'required|string|max:255',
            'attribute_value' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255|unique:product_variants,sku,NULL,id',
            'price_override' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'parent_ids' => 'nullable|array',
            'parent_ids.*' => 'exists:product_variants,id',
        ]);

        $parentIds = $this->normalizeParents($product, $validated['parent_ids'] ?? []);
        abort_if($parentIds === null, 422, 'Selected parent variants do not belong to this product.');

        $variant = $product->variants()->create([
            'attribute_name' => $validated['attribute_name'],
            'attribute_value' => $validated['attribute_value'],
            'variant_name' => trim($validated['attribute_value']),
            'sku' => $validated['sku'] ?? null,
            'price_override' => $validated['price_override'] ?? null,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
        ]);

        if (!empty($parentIds)) {
            $variant->parents()->attach($parentIds);
        }

        return response()->json($this->node($variant), 201);
    }

    /**
     * Update a node's fields and (optionally) its parent links.
     */
    public function update(Request $request, ProductVariant $variant)
    {
        $validated = $request->validate([
            'attribute_name' => 'required|string|max:255',
            'attribute_value' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255|unique:product_variants,sku,'.$variant->id.',id',
            'price_override' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'parent_ids' => 'nullable|array',
            'parent_ids.*' => 'exists:product_variants,id',
        ]);

        $variant->update([
            'attribute_name' => $validated['attribute_name'],
            'attribute_value' => $validated['attribute_value'],
            'variant_name' => trim($validated['attribute_value']),
            'sku' => $validated['sku'] ?? null,
            'price_override' => $validated['price_override'] ?? null,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
        ]);

        if (array_key_exists('parent_ids', $validated)) {
            $parentIds = $this->normalizeParents($variant->product, $validated['parent_ids'] ?? []);
            abort_if($parentIds === null, 422, 'Selected parent variants do not belong to this product.');
            abort_if(in_array($variant->id, $parentIds, true) || $this->createsCycle($variant, $parentIds), 422, 'Variant cannot be linked under itself or one of its descendants.');
            $variant->parents()->sync($parentIds);
        }

        return response()->json($this->node($variant));
    }

    /**
     * Delete a node; child links cascade via the foreign keys.
     */
    public function destroy(ProductVariant $variant)
    {
        $variant->delete();
        return response()->noContent();
    }

    /**
     * Link specific product images to a variant node (any level).
     */
    public function images(Request $request, ProductVariant $variant)
    {
        $validated = $request->validate([
            'image_ids' => 'nullable|array',
            'image_ids.*' => 'exists:product_albums,id',
        ]);

        $ownedAlbumIds = ProductAlbum::where('product_id', $variant->product_id)->pluck('id')->all();
        $imageIds = array_values(array_intersect($validated['image_ids'] ?? [], $ownedAlbumIds));

        $variant->albums()->sync($imageIds);

        return response()->json($this->node($variant));
    }

    private function node(ProductVariant $variant): array
    {
        return $variant->load('parents', 'albums')->toArray();
    }

    private function normalizeParents(Product $product, array $parentIds): ?array
    {
        $ids = array_values(array_unique($parentIds));
        if (empty($ids)) {
            return [];
        }
        $owned = $product->variants()->whereIn('id', $ids)->pluck('id')->all();
        return count($owned) === count($ids) ? $owned : null;
    }

    private function createsCycle(ProductVariant $variant, array $parentIds): bool
    {
        $variantIds = collect([$variant->id])->merge($this->descendantIds($variant->id));
        foreach ($parentIds as $parentId) {
            if ($variantIds->contains($parentId)) {
                return true;
            }
        }
        return false;
    }

    private function descendantIds(string $id): array
    {
        $ids = [];
        $queue = [$id];
        while ($queue) {
            $current = array_pop($queue);
            $children = DB::table('variant_links')->where('parent_variant_id', $current)->pluck('child_variant_id')->all();
            foreach ($children as $child) {
                $ids[] = $child;
                $queue[] = $child;
            }
        }
        return $ids;
    }
}
