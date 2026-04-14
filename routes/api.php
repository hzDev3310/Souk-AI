<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\EmployeeController;
use App\Http\Controllers\Api\Admin\InfluencerController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\ShippingCompanyController;
use App\Http\Controllers\Api\Admin\StoreController;
use App\Http\Controllers\Api\Admin\UserManagementController;
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

    // User Management Routes (comprehensive CRUD)
    Route::prefix('users')->group(function () {
        // Clients
        Route::get('/clients', [UserManagementController::class, 'getClients']);
        Route::post('/clients', [UserManagementController::class, 'createClient']);
        Route::put('/clients/{id}', [UserManagementController::class, 'updateClient']);
        Route::delete('/clients/{id}', [UserManagementController::class, 'deleteClient']);

        // Influencers
        Route::get('/influencers', [UserManagementController::class, 'getInfluencers']);
        Route::post('/influencers', [UserManagementController::class, 'createInfluencer']);
        Route::put('/influencers/{id}', [UserManagementController::class, 'updateInfluencer']);
        Route::delete('/influencers/{id}', [UserManagementController::class, 'deleteInfluencer']);

        // Stores
        Route::get('/stores', [UserManagementController::class, 'getStores']);
        Route::post('/stores', [UserManagementController::class, 'createStore']);
        Route::put('/stores/{id}', [UserManagementController::class, 'updateStore']);
        Route::delete('/stores/{id}', [UserManagementController::class, 'deleteStore']);

        // Admins
        Route::get('/admins', [UserManagementController::class, 'getAdmins']);
        Route::post('/admins', [UserManagementController::class, 'createAdmin']);
        Route::put('/admins/{id}', [UserManagementController::class, 'updateAdmin']);
        Route::delete('/admins/{id}', [UserManagementController::class, 'deleteAdmin']);

        // Shipping Companies
        Route::get('/shipping-companies', [UserManagementController::class, 'getShippingCompanies']);
        Route::post('/shipping-companies', [UserManagementController::class, 'createShippingCompany']);
        Route::put('/shipping-companies/{id}', [UserManagementController::class, 'updateShippingCompany']);
        Route::delete('/shipping-companies/{id}', [UserManagementController::class, 'deleteShippingCompany']);

        // Shipping Employees
        Route::get('/shipping-emps', [UserManagementController::class, 'getShippingEmps']);
        Route::post('/shipping-emps', [UserManagementController::class, 'createShippingEmp']);
        Route::put('/shipping-emps/{id}', [UserManagementController::class, 'updateShippingEmp']);
        Route::delete('/shipping-emps/{id}', [UserManagementController::class, 'deleteShippingEmp']);

        // General User Actions
        Route::get('/{id}', [UserManagementController::class, 'getUser']);
        Route::post('/{id}/block', [UserManagementController::class, 'blockUser']);
        Route::post('/{id}/unblock', [UserManagementController::class, 'unblockUser']);
        Route::delete('/{id}', [UserManagementController::class, 'deleteAnyUser']);
    });
});
