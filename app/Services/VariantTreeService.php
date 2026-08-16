<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

/**
 * Builds the nested variant tree (any depth, many parents per child) from the
 * flat `product_variants` collection + the `variant_links` pivot rows.
 * Used by both the admin builder and the storefront selector.
 */
class VariantTreeService
{
    public function treeFor(Product $product): array
    {
        $variants = $product->variants()->with('albums')->get();
        if ($variants->isEmpty()) {
            return [];
        }

        $byId = $variants->keyBy('id');

        $rows = DB::table('variant_links')
            ->whereIn('parent_variant_id', $byId->keys())
            ->orderBy('parent_variant_id')
            ->get();

        $childrenMap = [];
        $parentMap = [];
        foreach ($rows as $row) {
            $childrenMap[$row->parent_variant_id][] = $row->child_variant_id;
            $parentMap[$row->child_variant_id][] = $row->parent_variant_id;
        }

        $linkedChildIds = collect($rows)->pluck('child_variant_id')->all();
        $rootIds = $byId
            ->reject(fn ($v) => in_array($v->id, $linkedChildIds, true))
            ->sortBy('attribute_value')
            ->keys();

        foreach ($rootIds as $rootId) {
            $childrenMap[null][] = $rootId;
        }

        return $this->build($byId, $childrenMap, $parentMap, null, []);
    }

    /**
     * Resolve the option path for a selected leaf given an ordered list of
     * chosen node ids (root -> ... -> leaf). Returns null if the chain is
     * not a valid descendant path.
     */
    public function resolvePath(Product $product, array $pathIds): ?array
    {
        $byId = $product->variants()->get()->keyBy('id');

        if (empty($pathIds) || !isset($byId[$pathIds[array_key_last($pathIds)]])) {
            return null;
        }

        $path = [];
        for ($i = 0; $i < count($pathIds); $i++) {
            $node = $byId[$pathIds[$i]] ?? null;
            if (!$node) {
                return null;
            }
            $path[] = [
                'id' => $node->id,
                'attribute_name' => $node->attribute_name,
                'attribute_value' => $node->attribute_value,
                'sku' => $node->sku,
            ];

            if ($i < count($pathIds) - 1) {
                $linked = DB::table('variant_links')
                    ->where('parent_variant_id', $node->id)
                    ->where('child_variant_id', $pathIds[$i + 1])
                    ->exists();
                if (!$linked) {
                    return null;
                }
            }
        }

        return $path;
    }

    /**
     * Walk from a leaf variant up through its parents and return the
     * root → leaf path as an ordered array.  If a node has multiple
     * parents the first (by sort order) is followed — suitable for the
     * order-item snapshot where the primary selection path is enough.
     */
    public function pathFromLeaf(\App\Models\ProductVariant $leaf): array
    {
        $chain = [];
        $current = $leaf;

        while ($current) {
            array_unshift($chain, $current);
            $parentId = DB::table('variant_links')
                ->where('child_variant_id', $current->id)
                ->orderBy('parent_variant_id')
                ->value('parent_variant_id');
            if ($parentId) {
                $current = \App\Models\ProductVariant::find($parentId);
            } else {
                $current = null;
            }
        }

        return array_map(fn ($v) => [
            'id' => $v->id,
            'attribute_name' => $v->attribute_name,
            'attribute_value' => $v->attribute_value ?: $v->variant_name,
            'option_value' => $v->optionValueUrl(),
            'sku' => $v->sku,
        ], $chain);
    }

    private function build($byId, array $childrenMap, array $parentMap, ?string $parentId, array $parentAlbums): array
    {
        $branch = [];

        foreach ($childrenMap[$parentId] ?? [] as $childId) {
            $v = $byId[$childId] ?? null;
            if (!$v) {
                continue;
            }

            $ownAlbums = $v->albums->map(fn ($a) => [
                'id' => $a->id,
                'file' => $a->file,
            ])->values();

            // Use own albums; if empty, inherit from the nearest parent that has them
            $nodeAlbums = $ownAlbums->isNotEmpty() ? $ownAlbums->values() : collect($parentAlbums);

            $branch[] = [
                'id' => $v->id,
                'attribute_name' => $v->attribute_name,
                'attribute_value' => $v->attribute_value ?: $v->variant_name,
                'option_value' => $v->optionValueUrl(),
                'sku' => $v->sku,
                'stock_quantity' => (int) $v->stock_quantity,
                'parent_ids' => array_values($parentMap[$v->id] ?? []),
                'albums' => $nodeAlbums,
                'children' => $this->build($byId, $childrenMap, $parentMap, $v->id, $nodeAlbums->toArray()),
            ];
        }

        return $branch;
    }
}
