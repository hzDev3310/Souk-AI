<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use App\Models\Influencer;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'family_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::in(['CLIENT', 'INFLUENCER', 'STORE'])],
            // Client fields
            'address' => ['required_if:role,CLIENT', 'nullable', 'string'],
            'city' => ['required_if:role,CLIENT', 'nullable', 'string'],
            'code_postal' => ['required_if:role,CLIENT', 'nullable', 'string'],
            // Influencer fields
            'referral_code' => ['required_if:role,INFLUENCER', 'nullable', 'string', 'unique:influencers,referralCode'],
            'phone' => ['required_if:role,INFLUENCER', 'nullable', 'string'],
            'cin' => ['required_if:role,INFLUENCER', 'nullable', 'string'],
            // Store fields
            'store_name_fr' => ['required_if:role,STORE', 'nullable', 'string'],
            'store_name_ar' => ['nullable', 'string'],
            'store_name_en' => ['nullable', 'string'],
            'matricule_fiscale' => ['required_if:role,STORE', 'nullable', 'string'],
        ]);

        // Create user
        $user = User::create([
            'id' => (string) Str::uuid(),
            'name' => $validated['name'],
            'family_name' => $validated['family_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'isBlocked' => false,
        ]);

        // Create role-specific profile
        switch ($validated['role']) {
            case 'CLIENT':
                Client::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'address' => $validated['address'] ?? null,
                    'city' => $validated['city'] ?? null,
                    'codePostal' => $validated['code_postal'] ?? null,
                ]);
                break;

            case 'INFLUENCER':
                Influencer::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'referralCode' => $validated['referral_code'] ?? Str::random(8),
                    'commissionRate' => 5.0,
                    'phone' => $validated['phone'] ?? null,
                    'cin' => $validated['cin'] ?? null,
                    'isActive' => false, // Requires admin approval
                    'slug' => Str::slug($validated['name'] . '-' . Str::random(4)),
                ]);
                break;

            case 'STORE':
                Store::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'name_fr' => $validated['store_name_fr'] ?? null,
                    'name_ar' => $validated['store_name_ar'] ?? null,
                    'name_en' => $validated['store_name_en'] ?? null,
                    'matriculeFiscale' => $validated['matricule_fiscale'] ?? null,
                    'isActive' => false, // Requires admin approval
                    'slug' => Str::slug($validated['store_name_fr'] ?? $validated['name'] . '-' . Str::random(4)),
                    'promo' => 0,
                ]);
                break;
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load(strtolower($user->role)),
            'token' => $token,
            'message' => 'User registered successfully',
        ], 201);
    }

    /**
     * Login user (cookie-based)
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        if ($user->isBlocked) {
            return response()->json([
                'message' => 'Account is blocked. Please contact support.',
            ], 403);
        }

        // Check role-specific activation
        if (in_array($user->role, ['INFLUENCER', 'STORE'])) {
            $profile = $user->{strtolower($user->role)};
            if ($profile && !$profile->isActive) {
                return response()->json([
                    'message' => 'Account pending admin approval.',
                    'user' => $user->load(strtolower($user->role)),
                    'pending_approval' => true,
                ], 403);
            }
        }

        // Cookie-based login
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'user' => $user->load(strtolower($user->role)),
            'message' => 'Login successful',
        ]);
    }

    /**
     * Logout user (cookie-based)
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(strtolower($request->user()->role));
        return response()->json($user);
    }

    /**
     * Check auth status
     */
    public function check(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user()->load(strtolower(Auth::user()->role));
            return response()->json([
                'authenticated' => true,
                'user' => $user,
            ]);
        }

        return response()->json([
            'authenticated' => false,
        ], 401);
    }
}
