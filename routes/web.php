<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TranslationsController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;

Route::get('/login', [AuthController::class , 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class , 'login'])->name('login.post');
Route::post('/logout', [AuthController::class , 'logout'])->name('logout');

Route::get('/translations/{locale}', [TranslationsController::class , 'index']);

Route::get('/lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'fr', 'ar'])) {
        Session::put('locale', $locale);
        App::setLocale($locale);
    }
    return redirect()->back();
})->name('lang.switch');

// Locale-wrapped routes
Route::group(['prefix' => '{locale}', 'where' => ['locale' => 'en|fr|ar'], 'middleware' => 'web'], function () {
    Route::get('/', function () {
            return view('welcome');
        }
        )->name('home');

        Route::get('/example-blade', function () {
            return view('example-blade');
        }
        );

        Route::get('/example-react', function () {
            return view('example-react');
        }
        );
    });

Route::middleware(['auth', 'role:admin'])->get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*');

// Fallback for root
Route::get('/', function () {
    $locale = session('locale', config('app.locale'));
    return redirect("/{$locale}");
});