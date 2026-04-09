<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        return Store::with('user')->paginate(20);
    }

    public function show(Store $store)
    {
        return $store->load('user', 'products');
    }

    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'isActive' => 'boolean',
        ]);

        $store->update($validated);
        return $store;
    }

    public function destroy(Store $store)
    {
        $store->delete();
        return response()->noContent();
    }
}
