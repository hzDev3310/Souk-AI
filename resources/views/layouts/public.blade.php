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
            <form action="{{ route('public.search') }}" method="GET" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-2xl border border-border/40 focus-within:border-primary/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" name="q" value="{{ request('q') }}" placeholder="{{ __('website.search') }}" class="bg-transparent border-none outline-none text-xs font-bold w-24 xl:w-48 placeholder:text-muted-foreground/60 text-foreground">
            </form>

            <!-- Desktop Actions -->
            <div class="hidden lg:flex items-center gap-3">
                <a href="/favorites" class="relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-card hover:text-rose-500 transition-all border border-transparent hover:border-border/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    <span id="fav-count-desktop" class="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-background {{ count(session()->get('favorites', [])) > 0 ? '' : 'hidden' }}">
                        {{ count(session()->get('favorites', [])) }}
                    </span>
                </a>
                <a href="/cart" class="relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-card hover:text-primary transition-all border border-transparent hover:border-border/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <span id="cart-count-desktop" class="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-background {{ count(session()->get('cart', [])) > 0 ? '' : 'hidden' }}">
                        {{ count(session()->get('cart', [])) }}
                    </span>
                </a>
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
    <main class="min-h-screen pt-8 pb-32 lg:pb-20 container mx-auto px-4 md:px-12">
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

    <!-- Mobile Bottom Navigation -->
    <div class="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <div class="glass border border-border/40 rounded-[32px] p-2 flex items-center justify-around premium-shadow">
            <a href="/" class="flex flex-col items-center gap-1 p-2 {{ request()->is('/') ? 'text-primary' : 'text-muted-foreground' }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span class="text-[8px] font-black uppercase tracking-widest">Home</span>
            </a>
            <a href="/favorites" class="flex flex-col items-center gap-1 p-2 {{ request()->is('favorites*') ? 'text-primary' : 'text-muted-foreground' }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <span class="text-[8px] font-black uppercase tracking-widest">Saved</span>
            </a>
            <div class="relative -top-8">
                <a href="/cart" class="relative w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/40 border-4 border-background hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <span id="cart-count" class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-background animate-bounce shadow-lg {{ count(session()->get('cart', [])) > 0 ? '' : 'hidden' }}">
                        {{ count(session()->get('cart', [])) }}
                    </span>
                </a>
            </div>


            <a href="#" class="flex flex-col items-center gap-1 p-2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                <span class="text-[8px] font-black uppercase tracking-widest">Orders</span>
            </a>
            <a href="/login" class="flex flex-col items-center gap-1 p-2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="text-[8px] font-black uppercase tracking-widest">Profile</span>
            </a>
        </div>
    </div>

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
