<?php

use App\Http\Controllers\Api\Admin\EmployeeController;
use App\Http\Controllers\Api\Admin\InfluencerController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\ShippingCompanyController;
use App\Http\Controllers\Api\Admin\StoreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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
