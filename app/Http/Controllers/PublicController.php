<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function index()
    {
        $products = Product::with(['store', 'albums'])
            ->whereHas('store', function($query) {
                $query->where('isActive', true);
            })
            ->latest()
            ->paginate(12);

        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return view('public.home', compact('products', 'categories'));
    }

    public function product($slug)
    {
        $product = Product::with(['store', 'albums', 'variants'])
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedProducts = Product::with(['store', 'albums'])
            ->where('store_id', $product->store_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return view('public.product', compact('product', 'relatedProducts'));
    }

    public function category($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        
        $products = Product::whereJsonContains('categories', $category->id)
            ->with(['store', 'albums'])
            ->paginate(12);

        return view('public.category', compact('category', 'products'));
    }
}
