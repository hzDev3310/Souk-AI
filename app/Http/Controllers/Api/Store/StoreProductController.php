<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductAlbum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StoreProductController extends Controller
{
    /**
     * Get all products for the authenticated store
     */
    public function index(Request $request)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        $products = Product::where('store_id', $store->id)
            ->with('albums')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Create a new product for the store
     */
    public function store(Request $request)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_fr' => 'required|string',
            'description_ar' => 'required|string',
            'description_en' => 'required|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|in:NEW,USED,REFURBISHED',
            'stock' => 'required|integer|min:0',
            'promo' => 'required|numeric|min:0|max:100',
            'categories' => 'nullable|json',
            'images[]' => 'required|image|mimes:jpeg,png,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create([
            'store_id' => $store->id,
            'name_fr' => $request->name_fr,
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
            'description_fr' => $request->description_fr,
            'description_ar' => $request->description_ar,
            'description_en' => $request->description_en,
            'price' => $request->price,
            'condition' => $request->condition,
            'stock' => $request->stock,
            'promo' => $request->promo ?? 0,
            'categories' => $request->categories ? json_decode($request->categories) : [],
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product_images', 'public');
                ProductAlbum::create([
                    'product_id' => $product->id,
                    'file' => $path
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load('albums')
        ], 201);
    }

    /**
     * Get a specific product
     */
    public function show(Request $request, Product $product)
    {
        $store = $request->user()->store;

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $product->load('albums')
        ]);
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product)
    {
        $store = $request->user()->store;

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_fr' => 'required|string',
            'description_ar' => 'required|string',
            'description_en' => 'required|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|in:NEW,USED,REFURBISHED',
            'stock' => 'required|integer|min:0',
            'promo' => 'required|numeric|min:0|max:100',
            'categories' => 'nullable|json',
            'images[]' => 'nullable|image|mimes:jpeg,png,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product->update($request->except('images'));

        // Handle new image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product_images', 'public');
                ProductAlbum::create([
                    'product_id' => $product->id,
                    'file' => $path
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product->fresh()->load('albums')
        ]);
    }

    /**
     * Delete a product
     */
    public function destroy(Request $request, Product $product)
    {
        $store = $request->user()->store;

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Delete associated images
        foreach ($product->albums as $album) {
            if (Storage::exists('public/' . $album->file)) {
                Storage::delete('public/' . $album->file);
            }
            $album->delete();
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
