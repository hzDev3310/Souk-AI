<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\EmployeeController;
use App\Http\Controllers\Api\Admin\InfluencerController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\ShippingCompanyController;
use App\Http\Controllers\Api\Admin\StoreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// CSRF cookie for SPA
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
})->middleware('web');

// Auth routes (public, with web middleware for sessions)
Route::middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check', [AuthController::class, 'check']);
});

// Auth routes (protected with Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('users', function () {
        return \App\Models\User::all(['id', 'name']);
    });
    Route::apiResource('stores', StoreController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('influencers', InfluencerController::class);
    Route::apiResource('shipping-companies', ShippingCompanyController::class);
    Route::apiResource('employees', EmployeeController::class);
});
