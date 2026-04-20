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