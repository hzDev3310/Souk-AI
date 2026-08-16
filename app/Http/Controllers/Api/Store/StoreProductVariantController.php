<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\HandlesFileUploads;
use App\Models\Product;
use App\Models\ProductAlbum;
use App\Models\ProductVariant;
use App\Services\VariantTreeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Variant tree management for the store dashboard. Mirrors the admin
 * ProductVariantController but guards every operation so a store can only
 * manage the variants of its own products.
 */
class StoreProductVariantController extends Controller
{
    use HandlesFileUploads;

    public function __construct(private VariantTreeService $treeService)
    {
    }

    private function ownedProduct(Request $request, Product $product): Product
    {
        $store = $request->user()->store;
        abort_if(!$store || $product->store_id !== $store->id, 403, 'Unauthorized');

        return $product;
    }

    private function ownedVariant(Request $request, ProductVariant $variant): ProductVariant
    {
        $store = $request->user()->store;
        abort_if(!$store || $variant->product->store_id !== $store->id, 403, 'Unauthorized');

        return $variant;
    }

    public function tree(Request $request, Product $product)
    {
        $this->ownedProduct($request, $product);

        return response()->json($this->treeService->treeFor($product));
    }

    public function options(Request $request, Product $product)
    {
        $this->ownedProduct($request, $product);

        $nodes = $product->variants()->with('parents')->get()->map(function ($v) {
            return [
                'id' => $v->id,
                'attribute_name' => $v->attribute_name,
                'attribute_value' => $v->attribute_value ?: $v->variant_name,
                'option_value' => $v->optionValueUrl(),
                'sku' => $v->sku,
                'stock_quantity' => (int) $v->stock_quantity,
                'parent_ids' => $v->parents->pluck('id'),
                'albums' => $v->albums->map(fn ($a) => ['id' => $a->id, 'file' => $a->file]),
            ];
        });

        return response()->json($nodes);
    }

    public function store(Request $request, Product $product)
    {
        $this->ownedProduct($request, $product);

        $validated = $request->validate([
            'attribute_name' => 'required|string|max:255',
            'attribute_value' => 'required|string|max:255',
            'option_value' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:255|unique:product_variants,sku,NULL,id',
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
            'option_value' => $validated['option_value'] ?? null,
            'sku' => $validated['sku'] ?? null,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
        ]);

        if (!empty($parentIds)) {
            $variant->parents()->attach($parentIds);
        }

        return response()->json($this->node($variant), 201);
    }

    public function update(Request $request, ProductVariant $variant)
    {
        $this->ownedVariant($request, $variant);

        $validated = $request->validate([
            'attribute_name' => 'required|string|max:255',
            'attribute_value' => 'required|string|max:255',
            'option_value' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:255|unique:product_variants,sku,'.$variant->id.',id',
            'stock_quantity' => 'nullable|integer|min:0',
            'parent_ids' => 'nullable|array',
            'parent_ids.*' => 'exists:product_variants,id',
        ]);

        $variant->update([
            'attribute_name' => $validated['attribute_name'],
            'attribute_value' => $validated['attribute_value'],
            'variant_name' => trim($validated['attribute_value']),
            'option_value' => $validated['option_value'] ?? null,
            'sku' => $validated['sku'] ?? null,
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

    public function children(Request $request, ProductVariant $variant)
    {
        $this->ownedVariant($request, $variant);

        $children = $variant->children()->with('albums', 'parents')->get()->map(function ($child) {
            return [
                'id' => $child->id,
                'attribute_name' => $child->attribute_name,
                'attribute_value' => $child->attribute_value ?: $child->variant_name,
                'option_value' => $child->optionValueUrl(),
                'sku' => $child->sku,
                'stock_quantity' => (int) $child->stock_quantity,
                'parent_ids' => $child->parents->pluck('id'),
                'albums' => $child->albums->map(fn ($a) => ['id' => $a->id, 'file' => $a->file])->values(),
                'children_count' => $child->children()->count(),
            ];
        })->values();

        return response()->json([
            'variant' => [
                'id' => $variant->id,
                'attribute_name' => $variant->attribute_name,
                'attribute_value' => $variant->attribute_value ?: $variant->variant_name,
                'option_value' => $variant->optionValueUrl(),
                'sku' => $variant->sku,
            ],
            'children' => $children,
        ]);
    }

    public function icon(Request $request, ProductVariant $variant)
    {
        $this->ownedVariant($request, $variant);

        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);

        try {
            $path = $this->storeUploadedFile(
                $request->file('image'),
                'variants',
                'variant',
                $variant->product_id
            );
        } catch (\Throwable) {
            return $this->fileUploadErrorResponse();
        }

        $variant->update(['option_value' => $path]);

        return response()->json(['option_value' => $variant->optionValueUrl()]);
    }

    public function destroy(Request $request, ProductVariant $variant)
    {
        $this->ownedVariant($request, $variant);

        $variant->delete();

        return response()->noContent();
    }

    public function images(Request $request, ProductVariant $variant)
    {
        $this->ownedVariant($request, $variant);

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
