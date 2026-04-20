<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\EmployeeController;
use App\Http\Controllers\Api\Admin\InfluencerController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\ShippingCompanyController;
use App\Http\Controllers\Api\Admin\StoreController;
use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\Store\StoreProfileController;
use App\Http\Controllers\Api\Store\StoreProductController;
use App\Http\Controllers\Api\Store\StoreOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/check', [AuthController::class, 'check']);

// Public Category Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
});

// Admin Routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('users', function () {
        return \App\Models\User::all(['id', 'name']);
    });
    Route::get('categories/all', [CategoryController::class, 'list']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('stores', StoreController::class);
    Route::apiResource('products', ProductController::class);
    
    // Order Management
    Route::apiResource('orders', OrderController::class);
    Route::post('orders/{id}/verify', [OrderController::class, 'verify']);
    Route::post('orders/{id}/confirm-manually', [OrderController::class, 'confirmManually']);
    Route::post('orders/{order}/items/{item}/status', [OrderController::class, 'updateItemStatus']);
    Route::delete('orders/{order}/items/{item}', [OrderController::class, 'removeItem']);

    Route::apiResource('influencers', InfluencerController::class);
    Route::apiResource('shipping-companies', ShippingCompanyController::class);
    Route::apiResource('employees', EmployeeController::class);

    // User Management Routes
    Route::prefix('users')->group(function () {
        Route::get('/clients', [UserManagementController::class, 'getClients']);
        Route::post('/clients', [UserManagementController::class, 'createClient']);
        Route::put('/clients/{id}', [UserManagementController::class, 'updateClient']);
        Route::delete('/clients/{id}', [UserManagementController::class, 'deleteClient']);

        Route::get('/influencers', [UserManagementController::class, 'getInfluencers']);
        Route::post('/influencers', [UserManagementController::class, 'createInfluencer']);
        Route::put('/influencers/{id}', [UserManagementController::class, 'updateInfluencer']);
        Route::delete('/influencers/{id}', [UserManagementController::class, 'deleteInfluencer']);

        Route::get('/stores', [UserManagementController::class, 'getStores']);
        Route::post('/stores', [UserManagementController::class, 'createStore']);
        Route::put('/stores/{id}', [UserManagementController::class, 'updateStore']);
        Route::delete('/stores/{id}', [UserManagementController::class, 'deleteStore']);

        Route::get('/admins', [UserManagementController::class, 'getAdmins']);
        Route::post('/admins', [UserManagementController::class, 'createAdmin']);
        Route::put('/admins/{id}', [UserManagementController::class, 'updateAdmin']);
        Route::delete('/admins/{id}', [UserManagementController::class, 'deleteAdmin']);

        Route::get('/shipping-companies', [UserManagementController::class, 'getShippingCompanies']);
        Route::post('/shipping-companies', [UserManagementController::class, 'createShippingCompany']);
        Route::put('/shipping-companies/{id}', [UserManagementController::class, 'updateShippingCompany']);
        Route::delete('/shipping-companies/{id}', [UserManagementController::class, 'deleteShippingCompany']);

        Route::get('/shipping-emps', [UserManagementController::class, 'getShippingEmps']);
        Route::post('/shipping-emps', [UserManagementController::class, 'createShippingEmp']);
        Route::put('/shipping-emps/{id}', [UserManagementController::class, 'updateShippingEmp']);
        Route::delete('/shipping-emps/{id}', [UserManagementController::class, 'deleteShippingEmp']);

        Route::get('/{id}', [UserManagementController::class, 'getUser']);
        Route::post('/{id}/block', [UserManagementController::class, 'blockUser']);
        Route::post('/{id}/unblock', [UserManagementController::class, 'unblockUser']);
        Route::delete('/{id}', [UserManagementController::class, 'deleteAnyUser']);
    });
});

// Shipping Company Routes (Logistics)
Route::middleware(['auth:sanctum', 'role:shipping_company'])->prefix('shipping')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
});

// Store Routes
Route::middleware(['auth:sanctum', 'role:store'])->prefix('store')->group(function () {
    Route::get('/profile', [StoreProfileController::class, 'profile']);
    Route::post('/profile', [StoreProfileController::class, 'updateProfile']);

    Route::get('/products', [StoreProductController::class, 'index']);
    Route::post('/products', [StoreProductController::class, 'store']);
    Route::get('/products/{product}', [StoreProductController::class, 'show']);
    Route::post('/products/{product}', [StoreProductController::class, 'update']);
    Route::delete('/products/{product}', [StoreProductController::class, 'destroy']);

    Route::get('/orders', [StoreOrderController::class, 'index']);
    Route::get('/orders/{order}', [StoreOrderController::class, 'show']);
    Route::post('/orders/{order}/status', [StoreOrderController::class, 'updateStatus']); // Legacy
    Route::post('/orders/{order}/items/{item}/status', [OrderController::class, 'updateItemStatus']);
});
