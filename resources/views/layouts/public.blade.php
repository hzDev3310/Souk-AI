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

@php
    $designSettings = settings_group('design', [
        'primary_color' => '#6366f1',
        'secondary_color' => '#f43f5e',
        'radius' => '28px'
    ]);
    $websiteName = setting('website_name', 'Souk AI');
    $websiteLogo = setting('website_logo');
    $footerAbout = setting('footer_about_'.app()->getLocale(), __('website.footer.aboutText'));
    $contactAddress = setting('contact_address_'.app()->getLocale(), setting('contact_address_en', 'Tunis, Tunisia'));
@endphp

    <style>
        :root {
            --primary: {{ $designSettings['primary_color'] }};
            --secondary: {{ $designSettings['secondary_color'] }};
            --radius: {{ $designSettings['radius'] }};
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .ai-shimmer {
            position: relative;
            overflow: hidden;
        }

        .ai-shimmer::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
            );
            transform: translateX(-100%);
            animation: shimmer 3s infinite;
        }

        .btn-ai-search {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            box-shadow: 0 4px 15px -1px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .btn-ai-search:hover {
            box-shadow: 0 10px 25px -5px rgba(var(--primary-rgb), 0.4);
            filter: brightness(1.1);
        }
    </style>

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
    <nav class="sticky top-0 z-50 mt-4 mx-4 md:mx-12">
        <div class="glass border-b premium-shadow rounded-[28px] px-4 py-4 md:px-6">
            <div class="flex items-center justify-between gap-3 lg:gap-6">
                <a href="/" class="flex items-center gap-2 group flex-shrink-0">
                    <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden group-hover:rotate-12 transition-transform">
                        @if($websiteLogo)
                            <img
                                src="{{ str_starts_with($websiteLogo, 'http') ? $websiteLogo : '/storage/'.$websiteLogo }}"
                                alt="{{ $websiteName }}"
                                class="w-full h-full object-contain p-1.5 bg-white"
                            >
                        @else
                            <span class="text-white font-black text-xl">{{ strtoupper(substr($websiteName, 0, 1)) }}</span>
                        @endif
                    </div>
                    <span class="text-lg md:text-xl font-black tracking-tight text-foreground">{{ $websiteName }}</span>
                </a>

                <form action="{{ route('public.search') }}" method="GET" class="hidden lg:flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-2xl border border-border/40 focus-within:border-primary/50 transition-colors flex-1 max-w-3xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground flex-shrink-0">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                    </svg>
                    <input 
                        type="text" 
                        name="q" 
                        value="{{ request('q') }}" 
                        placeholder="{{ __('website.searchPlaceholder') }}" 
                        class="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-muted-foreground/60 text-foreground"
                        autocomplete="off"
                    >
                    <button type="submit" name="search_mode" value="keyword" class="px-3 py-2 rounded-xl bg-card/70 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-card transition-colors whitespace-nowrap">
                        {{ __('website.searchbutton') }}
                    </button>
                    <button type="submit" name="search_mode" value="semantic" class="btn-ai-search ai-shimmer group flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 active:scale-95 transition-all whitespace-nowrap" title="{{ __('website.aisearchHelp') }}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-12 transition-transform duration-300">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                            <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
                        </svg>
                        <span>{{ __('website.aisearch') }}</span>
                    </button>
                </form>

                <div class="flex items-center gap-2 md:gap-4">
                    <button id="open-mobile-search" class="flex lg:hidden w-10 h-10 rounded-xl items-center justify-center text-muted-foreground hover:bg-card hover:text-primary transition-all border border-transparent hover:border-border/40">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>

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

            @auth
            <div class="relative group">
                <button class="flex items-center gap-3 px-4 py-2 bg-muted/30 border border-border/40 rounded-2xl hover:bg-muted/50 transition-all">
                    <div class="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-black text-[10px]">
                        {{ substr(Auth::user()->name, 0, 1) }}
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-widest text-foreground">{{ Auth::user()->name }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <!-- User Dropdown -->
                <div class="absolute top-full right-0 mt-2 w-48 glass border border-border/40 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-[60] shadow-2xl">
                    <a href="{{ route('public.profile') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Edit Profile
                    </a>
                    <a href="{{ route('public.orders') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                        My Orders
                    </a>
                    <div class="h-[1px] bg-border/40 my-1 mx-2"></div>
                    <a href="{{ route('dashboard') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                        Vendor Dashboard
                    </a>
                    <div class="h-[1px] bg-border/40 my-1 mx-2"></div>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                            Logout
                        </button>
                    </form>
                </div>
            </div>
            @else
            <a href="/login" class="px-5 py-2.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primaryemphasis shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap">
                {{ __('website.login') }}
            </a>
            @endauth
                </div>
            </div>
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
                    <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden">
                        @if($websiteLogo)
                            <img
                                src="{{ str_starts_with($websiteLogo, 'http') ? $websiteLogo : '/storage/'.$websiteLogo }}"
                                alt="{{ $websiteName }}"
                                class="w-full h-full object-contain p-1.5 bg-white"
                            >
                        @else
                            <span class="text-white font-black text-xl">{{ strtoupper(substr($websiteName, 0, 1)) }}</span>
                        @endif
                    </div>
                    <span class="text-xl font-black tracking-tight text-foreground">{{ $websiteName }}</span>
                </div>
                <p class="text-sm text-muted-foreground font-medium leading-relaxed">
                    {{ $footerAbout }}
                </p>
            </div>
            
            <div>
                <h4 class="font-black text-xs uppercase tracking-[0.2em] mb-8 text-foreground">{{ __('website.footer.explore') }}</h4>
                <ul class="space-y-4">
                    <li><a href="{{ route('public.all-products', ['sort' => 'latest']) }}" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{{ __('website.footer.latest') }}</a></li>
                    <li><a href="{{ route('public.all-stores') }}" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{{ __('website.footer.bestStores') }}</a></li>
                    <li><a href="{{ route('public.all-categories') }}" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{{ __('website.footer.categories') }}</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-black text-xs uppercase tracking-[0.2em] mb-8 text-foreground">{{ __('website.footer.support') }}</h4>
                <ul class="space-y-4">
                    <li><a href="{{ route('public.about') }}" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{{ __('website.footer.aboutLink') }}</a></li>
                    <li><a href="{{ route('public.contact') }}" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{{ __('website.footer.contact') }}</a></li>
                    <li><a href="{{ route('public.terms') }}" class="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{{ __('website.footer.terms') }}</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-black text-xs uppercase tracking-[0.2em] mb-8 text-foreground">{{ __('website.footer.contactInfo') }}</h4>
                <div class="space-y-4 text-sm font-bold text-muted-foreground">
                    <p>{{ setting('contact_email', 'support@soukai.com') }}</p>
                    <p>{{ setting('contact_phone', '+216 00 000 000') }}</p>
                    <p>{{ $contactAddress }}</p>
                    @if(setting('contact_location_url'))
                        <a href="{{ setting('contact_location_url') }}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-primary hover:text-primaryemphasis transition-colors">
                            {{ __('website.footer.viewLocation') }}
                        </a>
                    @endif
                </div>
            </div>
        </div>
        
        <div class="container mx-auto px-12 mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
            <p>{{ __('website.footer.rights') }}</p>
            <div class="flex gap-8">
                <a href="#">X (Twitter)</a>
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
            </div>
        </div>
    </footer>

    <!-- Mobile Search Overlay -->
    <div id="mobile-search-overlay" class="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl opacity-0 invisible transition-all duration-300">
        <div class="p-6 pt-12">
            <div class="flex items-center gap-4 mb-8">
                <button id="close-search" class="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div class="flex-1">
                    <h3 class="text-xl font-black text-foreground">Search</h3>
                </div>
            </div>

            <p class="mb-4 text-sm font-medium text-muted-foreground">{{ __('website.aiSearchInstruction') }}</p>

            <form action="{{ route('public.search') }}" method="GET" class="space-y-3">
                <div class="relative group">
                    <input type="text" name="q" id="mobile-search-input" placeholder="{{ __('website.searchPlaceholder') }}" class="w-full bg-card glass border border-border/40 rounded-[28px] px-8 py-5 text-lg font-bold text-foreground focus:border-primary outline-none transition-all shadow-2xl shadow-primary/5">
                    <button type="submit" name="search_mode" value="keyword" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                </div>
                <button type="submit" name="search_mode" value="semantic" class="w-full rounded-2xl bg-primary px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-primaryemphasis">
                    {{ __('website.aiSearch') }}
                </button>
            </form>
        </div>
    </div>

   <!-- Mobile Bottom Navigation -->
<!-- Mobile Bottom Navigation -->
<!-- Mobile Bottom Navigation -->
<div class="lg:hidden fixed bottom-4 left-4 right-4 z-50">
    <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-[28px] p-1.5 flex items-center justify-around shadow-lg shadow-gray-200/50 dark:shadow-gray-950/50">
        
        <!-- Home -->
        <a href="/" class="group flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 {{ request()->is('/') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="{{ request()->is('/') ? 'currentColor' : 'none' }}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="text-[9px] font-semibold tracking-wide">{{ __('website.nav.home') }}</span>
        </a>
        
        <!-- Cart -->
        <a href="/cart" class="group flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 {{ request()->is('cart*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
            <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                    <path d="M3 6h18"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span id="cart-count-mobile" class="absolute -top-2 -right-3 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-4 px-1 rounded-full flex items-center justify-center border border-white dark:border-gray-900 shadow-sm {{ count(session()->get('cart', [])) > 0 ? '' : 'hidden' }}">
                    {{ count(session()->get('cart', [])) }}
                </span>
            </div>
            <span class="text-[9px] font-semibold tracking-wide">Cart</span>
        </a>

        <!-- Search (FAB - Middle) -->
        <div class="relative -mt-8">
            <button id="open-mobile-search" class="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/40 dark:shadow-primary/20 active:scale-95 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="10.5" cy="10.5" r="6.5"/>
                    <path d="m16 16 3 3"/>
                </svg>
            </button>
        </div>

        <!-- Orders -->
        <a href="{{ route('public.orders') }}" class="group flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 {{ request()->is('orders*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
            </svg>
            <span class="text-[9px] font-semibold tracking-wide">Orders</span>
        </a>

        <!-- Profile / Login -->
        @auth
        <a href="{{ route('public.profile') }}" class="group flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 {{ request()->is('profile*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                {{ substr(Auth::user()->name, 0, 1) }}
            </div>
            <span class="text-[9px] font-semibold tracking-wide">Profile</span>
        </a>
        @else
        <a href="/login" class="group flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 {{ request()->is('login*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="text-[9px] font-semibold tracking-wide">Login</span>
        </a>
        @endauth
    </div>
</div>


<!-- Bottom safe area spacer -->
<div class="lg:hidden h-20"></div>

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

        // Mobile Search Logic
        const openSearchBtn = document.getElementById('open-mobile-search');
        const closeSearchBtn = document.getElementById('close-search');
        const searchOverlay = document.getElementById('mobile-search-overlay');
        const searchInput = document.getElementById('mobile-search-input');

        openSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('invisible', 'opacity-0');
            searchOverlay.classList.add('visible', 'opacity-100');
            // Small delay to ensure the overlay is transitioning before focusing
            setTimeout(() => searchInput.focus(), 300);
        });

        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('invisible', 'opacity-0');
            searchOverlay.classList.remove('visible', 'opacity-100');
            searchInput.blur();
        });

        const openSidebar = (name) => {
            const overlay = document.querySelector(`[data-sidebar-overlay="${name}"]`);
            const panel = document.querySelector(`[data-sidebar-panel="${name}"]`);
            if (!overlay || !panel) return;

            overlay.classList.remove('pointer-events-none', 'opacity-0');
            panel.classList.remove('translate-x-full');
            document.body.classList.add('overflow-hidden');
        };

        const closeSidebar = (name) => {
            const overlay = document.querySelector(`[data-sidebar-overlay="${name}"]`);
            const panel = document.querySelector(`[data-sidebar-panel="${name}"]`);
            if (!overlay || !panel) return;

            overlay.classList.add('pointer-events-none', 'opacity-0');
            panel.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        };

        document.querySelectorAll('[data-sidebar-open]').forEach((button) => {
            button.addEventListener('click', () => openSidebar(button.dataset.sidebarOpen));
        });

        document.querySelectorAll('[data-sidebar-close]').forEach((button) => {
            button.addEventListener('click', () => closeSidebar(button.dataset.sidebarClose));
        });

        document.querySelectorAll('[data-sidebar-overlay]').forEach((overlay) => {
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    closeSidebar(overlay.dataset.sidebarOverlay);
                }
            });
        });
    </script>
</body>
</html>
