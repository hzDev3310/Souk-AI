<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Try to get locale from URL segment first
        $locale = $request->segment(1);

        if (in_array($locale, ['en', 'fr', 'ar'])) {
            // Locale is in URL
            app()->setLocale($locale);
            session()->put('locale', $locale);
        }
        elseif (session()->has('locale') && in_array(session()->get('locale'), ['en', 'fr', 'ar'])) {
            // Locale is in session
            app()->setLocale(session()->get('locale'));
        }
        else {
            // Use default locale
            $defaultLocale = config('app.locale', 'en');
            app()->setLocale($defaultLocale);
            session()->put('locale', $defaultLocale);
        }

        return $next($request);
    }
}