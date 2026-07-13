<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\ContactSetting;
use App\Models\PageImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PageContentController extends Controller
{
    public function show(string $slug)
    {
        $page = Page::where('slug', $slug)->with('images')->firstOrFail();
        $contact = ContactSetting::instance();

        return response()->json([
            'page' => $page,
            'contact' => $contact,
        ]);
    }

    public function update(Request $request, string $slug)
    {
        $validated = $request->validate([
            'title_en' => 'nullable|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'subtitle_fr' => 'nullable|string|max:255',
            'subtitle_ar' => 'nullable|string|max:255',
            'content_en' => 'nullable|string',
            'content_fr' => 'nullable|string',
            'content_ar' => 'nullable|string',
            // Contact fields
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address_en' => 'nullable|string|max:255',
            'address_fr' => 'nullable|string|max:255',
            'address_ar' => 'nullable|string|max:255',
            'map_embed_url' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $page = Page::updateOrCreate(
                ['slug' => $slug],
                collect($validated)->only([
                    'title_en', 'title_fr', 'title_ar',
                    'subtitle_en', 'subtitle_fr', 'subtitle_ar',
                    'content_en', 'content_fr', 'content_ar',
                ])->toArray()
            );

            if ($slug === 'contact') {
                $contact = ContactSetting::instance();
                $contact->update(collect($validated)->only([
                    'email', 'phone', 'address_en', 'address_fr', 'address_ar', 'map_embed_url',
                ])->toArray());
            }

            DB::commit();

            return response()->json([
                'page' => $page->fresh('images'),
                'message' => 'Page updated successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update page'], 500);
        }
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'imageable_type' => 'required|string',
            'imageable_id' => 'required|integer',
        ]);

        $path = $request->file('image')->store('pages', 'public');

        $image = PageImage::create([
            'imageable_type' => $request->imageable_type,
            'imageable_id' => $request->imageable_id,
            'image_path' => $path,
            'sort_order' => PageImage::where('imageable_type', $request->imageable_type)
                ->where('imageable_id', $request->imageable_id)
                ->max('sort_order') + 1,
        ]);

        return response()->json($image);
    }

    public function deleteImage(string $id)
    {
        $image = PageImage::findOrFail($id);

        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted']);
    }

    public function reorderImages(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:page_images,id',
        ]);

        foreach ($request->ids as $index => $id) {
            PageImage::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['message' => 'Images reordered']);
    }
}
