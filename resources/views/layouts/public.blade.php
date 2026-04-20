<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @yield('seo')
    
    <title>{{ $title ?? 'Souk AI - Premium Marketplace' }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Scripts and Styles -->
    @vite(['resources/css/app.css'])

    <!-- Head Scripts (Theme) -->
    <script>
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>
</head>
<body class="antialiased bg-background text-foreground font-sans selection:bg-primary selection:text-white transition-colors duration-500 overflow-x-hidden">
    
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 glass border-b premium-shadow mt-4 mx-4 md:mx-12 rounded-[28px] px-6 py-4 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 group">
            <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <span class="text-white font-black text-xl">S</span>
            </div>
            <span class="text-xl font-black tracking-tight text-foreground">Souk<span class="text-primary">AI</span></span>
        </a>

        <div class="hidden lg:flex items-center gap-8">
            <a href="/" class="nav-item font-bold text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground">{{ __('website.home') }}</a>
            <a href="#" class="nav-item font-bold text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground">{{ __('website.trending') }}</a>
            <a href="#" class="nav-item font-bold text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground">{{ __('website.flashSales') }}</a>
        </div>

        <div class="flex items-center gap-4">
            <!-- Search -->
            <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-2xl border border-border/40 focus-within:border-primary/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="{{ __('website.search') }}" class="bg-transparent border-none outline-none text-xs font-bold w-24 xl:w-48 placeholder:text-muted-foreground/60">
            </div>

            <!-- Toggles Group -->
            <div class="flex items-center gap-2 px-2 py-1 bg-muted/20 border border-border/40 rounded-2xl">
                <!-- Theme Toggle -->
                <button id="theme-toggle" class="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-card hover:text-primary transition-all">
                    <svg id="sun-icon" class="hidden dark:block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                    <svg id="moon-icon" class="block dark:hidden" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>

                <div class="w-[1px] h-4 bg-border/40 mx-1"></div>

                <!-- Lang Switcher -->
                <div class="relative group">
                    <button class="flex items-center gap-1.5 px-2 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        {{ app()->getLocale() }}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <!-- Dropdown -->
                    <div class="absolute top-full right-0 mt-2 w-32 glass border border-border/40 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-[60] shadow-2xl">
                        @foreach(['en' => 'English', 'fr' => 'Français', 'ar' => 'العربية'] as $code => $name)
                        <a href="{{ route('lang.switch', $code) }}" class="flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-primary hover:text-white transition-colors {{ app()->getLocale() == $code ? 'text-primary' : 'text-muted-foreground' }}">
                            {{ $name }}
                            @if(app()->getLocale() == $code)
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            @endif
                        </a>
                        @endforeach
                    </div>
                </div>
            </div>

            <a href="/login" class="px-5 py-2.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primaryemphasis shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap">
                {{ __('website.login') }}
            </a>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="min-h-screen pt-8 pb-20 container mx-auto px-4 md:px-12">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-card glass border-t mt-20 rounded-t-[60px] pt-16 pb-10">
        <div class="container mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="space-y-6">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <span class="text-white font-black text-xl">S</span>
                    </div>
                    <span class="text-xl font-black tracking-tight text-foreground">Souk<span class="text-primary">AI</span></span>
                </div>
                <p class="text-sm text-muted-foreground font-medium leading-relaxed">
                    Premium marketplace connecting creators and savvy shoppers. Optimized for quality and trust.
                </p>
            </div>
            
            <div>
                <h4 class="font-black text-xs uppercase tracking-[0.2em] mb-8 text-foreground">Explore</h4>
                <ul class="space-y-4">
                    <li><a href="#" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Latest Products</a></li>
                    <li><a href="#" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Best Stores</a></li>
                    <li><a href="#" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Categories</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-black text-xs uppercase tracking-[0.2em] mb-8 text-foreground">Support</h4>
                <ul class="space-y-4">
                    <li><a href="#" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                    <li><a href="#" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-black text-xs uppercase tracking-[0.2em] mb-8 text-foreground">Newsletter</h4>
                <div class="flex gap-2 p-2 bg-muted/40 rounded-2xl border border-border/40">
                    <input type="email" placeholder="Email address" class="bg-transparent border-none outline-none text-xs font-bold pl-2 flex-1">
                    <button class="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primaryemphasis transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 14 0"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="container mx-auto px-12 mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
            <p>© 2026 SOUK-AI. ALL RIGHTS RESERVED.</p>
            <div class="flex gap-8">
                <a href="#">X (Twitter)</a>
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
            </div>
        </div>
    </footer>

    @stack('scripts')
    <script>
        const themeToggleBtn = document.getElementById('theme-toggle');
        
        themeToggleBtn.addEventListener('click', function() {
            // Toggle theme
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    </script>
</body>
</html>
