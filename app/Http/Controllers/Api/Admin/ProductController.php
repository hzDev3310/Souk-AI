<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('store')->paginate(20);
    }

    public function show(Product $product)
    {
        return $product->load('store', 'variants', 'albums');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}
