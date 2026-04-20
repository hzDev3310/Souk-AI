<?php

use App\Http\Controllers\TranslationsController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;

Route::get('/translations/{locale}', [TranslationsController::class, 'index']);

Route::get('/lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'fr', 'ar'])) {
        Session::put('locale', $locale);
        App::setLocale($locale);
    }
    return redirect()->back();
})->name('lang.switch');

Route::middleware('web')->group(function () {
    // Public Pages (SEO Optimized)
    Route::get('/', [PublicController::class, 'index'])->name('home');
    Route::get('/p/{slug}', [PublicController::class, 'product'])->name('public.product');
    Route::get('/c/{slug}', [PublicController::class, 'category'])->name('public.category');
    Route::get('/search', [PublicController::class, 'search'])->name('public.search');

    // Cart & Favorites
    Route::get('/cart', [PublicController::class, 'cart'])->name('public.cart');
    Route::post('/cart/add', [PublicController::class, 'addToCart'])->name('public.cart.add');
    Route::post('/cart/remove', [PublicController::class, 'removeFromCart'])->name('public.cart.remove');
    Route::post('/cart/update', [PublicController::class, 'updateCart'])->name('public.cart.update');

    Route::get('/favorites', [PublicController::class, 'favorites'])->name('public.favorites');
    Route::post('/favorites/toggle', [PublicController::class, 'toggleFavorite'])->name('public.favorites.toggle');

    Route::get('/checkout', [PublicController::class, 'checkout'])->name('public.checkout');
    Route::post('/checkout', [PublicController::class, 'processCheckout'])->name('public.checkout.process');

    // Auth Pages (Redirect to SPA welcome)
    Route::get('/login', function () {
        return view('welcome');
    })->name('login');

    Route::get('/register', function () {
        return view('welcome');
    })->name('register');

    // SPA Dashboard (React)
    Route::get('/dashboard/{any?}', function () {
        return view('welcome');
    })->where('any', '.*')->name('dashboard');
});