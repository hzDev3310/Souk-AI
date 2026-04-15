<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get top-level categories with their immediate children
        $categories = Category::with('children')->whereNull('parent_id')->get();
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'isActive' => 'boolean'
        ]);

        $data = $request->except(['logo', 'cover']);
        $data['slug'] = Str::slug($request->name_en) . '-' . uniqid();

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('categories/logos', 'public');
            $data['logo'] = $path;
        }

        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('categories/covers', 'public');
            $data['cover'] = $path;
        }

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return response()->json($category->load(['children', 'parent']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'name_fr' => 'sometimes|required|string|max:255',
            'name_ar' => 'sometimes|required|string|max:255',
            'name_en' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'isActive' => 'boolean'
        ]);

        $data = $request->except(['logo', 'cover']);

        if ($request->hasFile('logo')) {
            if ($category->logo) {
                Storage::disk('public')->delete($category->logo);
            }
            $path = $request->file('logo')->store('categories/logos', 'public');
            $data['logo'] = $path;
        }

        if ($request->hasFile('cover')) {
            if ($category->cover) {
                Storage::disk('public')->delete($category->cover);
            }
            $path = $request->file('cover')->store('categories/covers', 'public');
            $data['cover'] = $path;
        }

        if ($request->has('name_en') && $request->name_en !== $category->name_en) {
            $data['slug'] = Str::slug($request->name_en) . '-' . uniqid();
        }

        $category->update($data);

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->logo) {
            Storage::disk('public')->delete($category->logo);
        }
        if ($category->cover) {
            Storage::disk('public')->delete($category->cover);
        }
        
        // Handle children? The schema has nullOnDelete, so children will become top-level categories.
        // If we want to delete children too, we should do it here. 
        // For now, let's keep it as per schema (nullOnDelete).
        
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    /**
     * Get all categories for select inputs (flattened or nested).
     */
    public function list()
    {
        return response()->json(Category::all(['id', 'name_en', 'name_fr', 'name_ar', 'parent_id', 'slug', 'isActive', 'logo']));
    }
}
