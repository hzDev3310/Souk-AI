<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesFileUploads;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use HandlesFileUploads;
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
        if (is_string($request->input('isActive'))) {
            $request->merge(['isActive' => filter_var($request->input('isActive'), FILTER_VALIDATE_BOOLEAN)]);
        }

        $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'isActive' => 'boolean'
        ]);

        $data = $request->except(['cover']);
        $data['slug'] = Str::slug($request->name_en) . '-' . uniqid();

        if ($request->hasFile('cover')) {
            try {
                $path = $this->storeUploadedFile($request->file('cover'), 'categories/covers', 'category', $request->name_en ?? 'category');
                $data['cover'] = $path;
            } catch (\Throwable $e) {
                return $this->fileUploadErrorResponse();
            }
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
        if ($request->input('parent_id') === '') {
            $request->merge(['parent_id' => null]);
        }

        if (is_string($request->input('isActive'))) {
            $request->merge(['isActive' => filter_var($request->input('isActive'), FILTER_VALIDATE_BOOLEAN)]);
        }

        $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'name_fr' => 'sometimes|required|string|max:255',
            'name_ar' => 'sometimes|required|string|max:255',
            'name_en' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'isActive' => 'boolean'
        ]);

        $data = $request->except(['cover']);

        if ($request->hasFile('cover')) {
            if ($category->cover) {
                Storage::disk('public')->delete($category->cover);
            }
            try {
                $path = $this->storeUploadedFile($request->file('cover'), 'categories/covers', 'category', $request->name_en ?? $category->name_en ?? 'category');
                $data['cover'] = $path;
            } catch (\Throwable $e) {
                return $this->fileUploadErrorResponse();
            }
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
        if ($category->cover) {
            Storage::disk('public')->delete($category->cover);
        }
        
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    /**
     * Get all categories for select inputs (flattened or nested).
     */
    public function list()
    {
        return response()->json(Category::all(['id', 'name_en', 'name_fr', 'name_ar', 'parent_id', 'slug', 'isActive']));
    }
}
