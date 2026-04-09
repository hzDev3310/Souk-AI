<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Influencer;
use Illuminate\Http\Request;

class InfluencerController extends Controller
{
    public function index()
    {
        return Influencer::with('user')->paginate(20);
    }

    public function show(Influencer $influencer)
    {
        return $influencer->load('user', 'orders');
    }

    public function update(Request $request, Influencer $influencer)
    {
        $validated = $request->validate([
            'isActive' => 'boolean',
            'commissionRate' => 'numeric',
        ]);

        $influencer->update($validated);
        return $influencer;
    }

    public function destroy(Influencer $influencer)
    {
        $influencer->delete();
        return response()->noContent();
    }
}
