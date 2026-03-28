<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/admin/users', [AuthController::class, 'createUser'])->middleware('auth:sanctum');

// User info routes
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/me', function (Request $request) {
    $user = $request->user()->load([
        'client',
        'influencer',
        'store',
        'admin',
        'shippingCompany',
        'shippingEmployee'
    ]);

    return response()->json(['user' => $user]);
})->middleware('auth:sanctum');