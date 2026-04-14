<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductAlbum;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['store', 'albums', 'categoryLinks'])->latest()->get();
        return response()->json($products);
    }

    public function show(Product $product)
    {
        return $product->load('store', 'variants', 'albums');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|in:NEW,GOOD,USED',
            'stock' => 'required|integer|min:0',
            'promo' => 'nullable|numeric|min:0|max:100',
            'categories' => 'nullable|json',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        $slug = Str::slug($validated['name_en'] ?? $validated['name_fr']) . '-' . uniqid();

        $product = Product::create([
            'store_id' => $validated['store_id'],
            'name_fr' => $validated['name_fr'],
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
            'description_fr' => $validated['description_fr'],
            'description_ar' => $validated['description_ar'],
            'description_en' => $validated['description_en'],
            'price' => $validated['price'],
            'condition' => $validated['condition'],
            'stock' => $validated['stock'],
            'promo' => $validated['promo'] ?? 0,
            'slug' => $slug,
            'categories' => json_decode($validated['categories'] ?? '[]', true),
        ]);

        if ($request->hasFile('images')) {
            $isFirst = true;
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductAlbum::create([
                    'product_id' => $product->id,
                    'file' => $path,
                    'isCover' => $isFirst,
                ]);
                $isFirst = false;
            }
        }

        return response()->json($product->load(['store', 'albums']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|in:NEW,GOOD,USED',
            'stock' => 'required|integer|min:0',
            'promo' => 'nullable|numeric|min:0|max:100',
            'categories' => 'nullable|json',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        $slug = $product->slug;
        if ($product->name_en !== $validated['name_en'] && $product->name_fr !== $validated['name_fr']) {
            $slug = Str::slug($validated['name_en'] ?? $validated['name_fr']) . '-' . uniqid();
        }

        $product->update([
            'store_id' => $validated['store_id'],
            'name_fr' => $validated['name_fr'],
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
            'description_fr' => $validated['description_fr'],
            'description_ar' => $validated['description_ar'],
            'description_en' => $validated['description_en'],
            'price' => $validated['price'],
            'condition' => $validated['condition'],
            'stock' => $validated['stock'],
            'promo' => $validated['promo'] ?? 0,
            'slug' => $slug,
            'categories' => json_decode($validated['categories'] ?? '[]', true),
        ]);

        if ($request->hasFile('images')) {
            // Delete old images
            foreach ($product->albums as $album) {
                Storage::disk('public')->delete($album->file);
                $album->delete();
            }

            $isFirst = true;
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductAlbum::create([
                    'product_id' => $product->id,
                    'file' => $path,
                    'isCover' => $isFirst,
                ]);
                $isFirst = false;
            }
        }

        return response()->json($product->load(['store', 'albums']));
    }

    public function destroy(Product $product)
    {
        foreach ($product->albums as $album) {
            Storage::disk('public')->delete($album->file);
        }
        $product->delete();
        return response()->noContent();
    }
}
