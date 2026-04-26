<?php

namespace App\Providers;

use App\Models\Product;
use App\Observers\ProductObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\App;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::useTailwind();
        Product::observe(ProductObserver::class);
        
        // Set locale from session or default to config
        if (Session::has('locale') && in_array(Session::get('locale'), ['en', 'fr', 'ar'])) {
            App::setLocale(Session::get('locale'));
        } else {
            // Set default locale on first visit
            $locale = config('app.locale', 'en');
            App::setLocale($locale);
            if (!Session::has('locale')) {
                Session::put('locale', $locale);
            }
        }
    }
}
