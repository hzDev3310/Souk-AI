<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Welcome') }} - EcoMarket</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>

<body class="bg-soft-white dark:bg-dark-premium text-gray-900 dark:text-gray-100 antialiased">
    <!-- Navbar with Language Switcher -->
    <nav class="fixed top-0 w-full z-50 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between glass py-3 px-6 rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 text-xl font-bold text-emerald-deep">
                Souk.AI
            </div>
            <div class="flex items-center gap-4">
                <div class="relative group">
                    <button
                        class="flex items-center gap-1 text-sm font-medium hover:text-emerald-deep transition-colors">
                        <span>{{ strtoupper(app()->getLocale()) }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        class="absolute right-0 mt-2 w-24 glass rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <a href="{{ route('lang.switch', 'en') }}"
                            class="block px-4 py-2 text-xs hover:text-emerald-deep transition-colors">English</a>
                        <a href="{{ route('lang.switch', 'fr') }}"
                            class="block px-4 py-2 text-xs hover:text-emerald-deep transition-colors">Français</a>
                        <a href="{{ route('lang.switch', 'ar') }}"
                            class="block px-4 py-2 text-xs hover:text-emerald-deep transition-colors">العربية</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="min-h-screen flex items-center justify-center p-6 pt-24">
        <div
            class="glass p-12 rounded-[2.5rem] max-w-2xl w-full text-center shadow-2xl border-2 border-white/50 dark:border-white/10">
            <div class="w-20 h-20 bg-emerald-deep/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-emerald-deep" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 class="text-4xl font-bold mb-4">Laravel <span class="text-emerald-deep">Blade</span> Page</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                {{ __('Welcome') }}! {{ __('This page is rendered directly by the server using Laravel\'s Blade
                templating engine.') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="{{ url('/') }}"
                    class="bg-emerald-deep text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-fresh transition-all">
                    Back Home
                </a>
                <a href="{{ url('/' . app()->getLocale() . '/example-react') }}"
                    class="bg-blue-ai/10 text-blue-ai px-8 py-3 rounded-2xl font-bold hover:bg-blue-ai/20 transition-all border border-blue-ai/10">
                    Switch to React example
                </a>
            </div>
        </div>
    </div>
</body>

</html>