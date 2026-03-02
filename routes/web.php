<?php

use App\Http\Controllers\TranslationsController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;

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

// Fallback for root
Route::get('/', function () {
    $locale = session('locale', config('app.locale'));
    return redirect("/{$locale}");
});