@extends('layouts.public')

@section('seo')
    <meta name="description"
        content="Discover premium products on Souk AI. The ultimate marketplace for quality-conscious shoppers.">
    <meta name="keywords" content="marketplace, shoppping, souk, ai, products, premium">
    <meta property="og:title" content="Souk AI - Premium Marketplace">
    <meta property="og:description" content="Discover premium products on Souk AI.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
@endsection

@section('content')
    <!-- Hero Section -->
    <section class="relative h-[480px] rounded-[60px] overflow-hidden mb-16 shadow-2xl shadow-primary/10" id="heroCarousel">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/40 via-primaryemphasis/50 to-main-bg-dark/70 z-10">
        </div>

        @php
            $heroSlides = $topCategories->filter(fn($c) => $c->cover)->values();
        @endphp

        @if($heroSlides->count())
            @foreach($heroSlides as $index => $slide)
                <img src="{{ Storage::url($slide->cover) }}"
                    data-hero-slide="{{ $index }}"
                    alt="{{ $slide->{'name_' . app()->getLocale()} }}"
                    class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 {{ $index === 0 ? 'opacity-100' : 'opacity-0' }}"
                    onerror="this.onerror=null; this.style.display='none';">
            @endforeach
        @else
            <img src="{{ setting('hero_image') ? (str_starts_with(setting('hero_image'), 'http') ? setting('hero_image') : '/storage/' . setting('hero_image')) : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' }}"
                class="absolute inset-0 w-full h-full object-cover"
                onerror="this.onerror=null; this.src='https://media.wallmantra.com/product/original/product_placeholder.webp';">
        @endif

        <div class="relative z-20 h-full flex flex-col justify-center items-start px-12 md:px-24 max-w-4xl space-y-8">
            <div
                class="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border-blue-400/20 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                {{ __('website.specialOffer') }}
            </div>

            <h1 class="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
                {!! preg_replace('/\*(.*?)\*/', '<span class="text-secondary">$1</span>', setting('hero_title_' . app()->getLocale(), __('website.heroTitle'))) !!}
            </h1>

            <p class="text-lg text-white/80 font-medium max-w-xl leading-relaxed">
                {{ setting('hero_subtitle_' . app()->getLocale(), __('website.heroSubtitle')) }}
            </p>

            <div class="flex flex-wrap gap-4 pt-4">
                <a href="#section-1"
                    class="px-8 py-4 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/10">
                    {{ __('website.exploreCollection') }}
                </a>
                <a href="/register"
                    class="px-8 py-4 glass text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border-white/20">
                    {{ __('website.joinAsSeller') }}
                </a>
            </div>
        </div>

        @if($heroSlides->count() > 1)
            <script>
                (function() {
                    const slides = document.querySelectorAll('[data-hero-slide]');
                    if (slides.length <= 1) return;
                    let current = 0;
                    setInterval(() => {
                        slides[current].classList.replace('opacity-100', 'opacity-0');
                        current = (current + 1) % slides.length;
                        slides[current].classList.replace('opacity-0', 'opacity-100');
                    }, 5000);
                })();
            </script>
        @endif
    </section>

    <!-- SECTION 1: Top Products by Orders -->
    <section id="section-1" class="mb-20">
        <div class="flex items-center justify-between mb-10 px-4">
            <div>
                <h2 class="text-3xl font-black text-foreground tracking-tight">{{ __('website.featuredProducts') }}</h2>
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                    {{ __('website.trending') }}</p>
            </div>
            <a href="{{ route('public.all-products', ['sort' => 'orders']) }}"
                class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            @forelse($topProducts as $product)
                <x-product-card :product="$product" :show-store="true" />
            @empty
                <div class="col-span-2 lg:col-span-4 py-10 text-center text-muted-foreground">
                    {{ __('website.noProductsCategory') }}
                </div>
            @endforelse
        </div>
    </section>

    <!-- SECTION 2: Top Categories by Orders -->
    <section class="mb-20">
        <div class="flex items-center justify-between mb-10 px-4">
            <div>
                <h2 class="text-3xl font-black text-foreground tracking-tight">{{ __('website.browseByCategory') }}</h2>
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                    {{ __('website.categories') }}</p>
            </div>
            <a href="{{ route('public.all-categories') }}"
                class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </a>
        </div>

        <style>
            .categories-scroll {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .categories-scroll::-webkit-scrollbar { display: none; }
            .categories-scroll { scroll-behavior: smooth; }
            @keyframes scroll-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .categories-scroll-inner {
                animation: scroll-left var(--scroll-duration, 30s) linear infinite;
            }
            .categories-scroll:hover .categories-scroll-inner {
                animation-play-state: paused;
            }
        </style>

        <div class="categories-scroll overflow-x-auto flex gap-4 px-4 pb-2" id="categoriesScroll">
            @forelse($topCategories as $category)
                <a href="{{ route('public.category', $category->slug) }}"
                    class="group flex-shrink-0 w-32 p-5 bg-card glass border border-border/40 rounded-[28px] text-center hover:bg-primary transition-all active:scale-95 premium-shadow">
                    <div
                        class="w-14 h-14 bg-muted/40 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 group-hover:scale-110 transition-all">
                        @if($category->icon)
                            @if(file_exists(public_path($category->icon)))
                                <img src="{{ asset($category->icon) }}" alt=""
                                    class="w-7 h-7 object-contain group-hover:brightness-0 group-hover:invert"
                                    onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <span style="display:none" class="text-primary group-hover:text-white transition-colors">{!! lucide_icon($category->icon, 'w-7 h-7') !!}</span>
                            @else
                                <span class="text-primary group-hover:text-white transition-colors">{!! lucide_icon($category->icon, 'w-7 h-7') !!}</span>
                            @endif
                        @else
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                                class="text-primary group-hover:text-white transition-colors">
                                <path d="m7.5 4.27 9 5.15" />
                                <path
                                    d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                <path d="m3.3 7 8.7 5 8.7-5" />
                                <path d="M12 22V12" />
                            </svg>
                        @endif
                    </div>
                    <h4
                        class="font-black text-[10px] uppercase tracking-widest text-foreground group-hover:text-white transition-colors">
                        {{ $category->{'name_' . app()->getLocale()} }}
                    </h4>
                </a>
            @empty
                <div class="w-full py-10 text-center text-muted-foreground">
                    No categories found
                </div>
            @endforelse
        </div>

        <script>
            (function() {
                const el = document.getElementById('categoriesScroll');
                if (!el) return;
                const count = {{ $topCategories->count() }};
                if (count > 5) {
                    const speed = Math.max(20, count * 5);
                    el.style.setProperty('--scroll-duration', speed + 's');
                    el.querySelector('.categories-scroll-inner')?.style.setProperty('--scroll-duration', speed + 's');
                }
            })();
        </script>
    </section>

    <!-- SECTION 3: Latest Products (Recent Additions) -->
    <section class="mb-20">
        <div class="flex items-center justify-between mb-10 px-4">
            <div>
                <h2 class="text-3xl font-black text-foreground tracking-tight">
                    {{ __('website.latestProducts') ?? 'Latest Products' }}</h2>
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                    {{ __('website.recentAdditions') ?? 'Recently Added' }}</p>
            </div>
            <a href="{{ route('public.all-products', ['sort' => 'latest']) }}"
                class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            @forelse($recentProducts as $product)

                <x-product-card :product="$product" :show-store="true" />

            @empty
                <div class="col-span-2 lg:col-span-4 py-10 text-center text-muted-foreground">
                    {{ __('website.noProductsCategory') }}
                </div>
            @endforelse
        </div>
    </section>

    <!-- SECTION 4: Top Stores by Orders -->
    <section class="mb-20">
        <div class="flex items-center justify-between mb-10 px-4">
            <div>
                <h2 class="text-3xl font-black text-foreground tracking-tight">
                    {{ __('website.bestStores') ?? 'Best Stores' }}</h2>
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                    {{ __('website.topSellers') ?? 'Top Sellers' }}</p>
            </div>
            <a href="{{ route('public.all-stores') }}"
                class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            @forelse($topStores as $store)
                <x-boutique-card :store="$store" />
            @empty
                <div class="col-span-2 lg:col-span-4 py-10 text-center text-muted-foreground">
                    No stores found
                </div>
            @endforelse
        </div>
    </section>



    <!-- Trust Banner -->
    <section
        class="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-card glass border border-border/40 rounded-[60px] premium-shadow">
        <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
            </div>
            <h4 class="font-black text-xs uppercase tracking-widest text-foreground">{{ __('website.trust.secure') }}</h4>
            <p class="text-xs font-bold text-muted-foreground leading-relaxed">{{ __('website.trust.secureDesc') }}</p>
        </div>
        <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m22 10-6-6-6 6" />
                    <path d="M22 10 16 16" />
                    <path d="M6 14h16" />
                </svg>
            </div>
            <h4 class="font-black text-xs uppercase tracking-widest text-foreground">{{ __('website.trust.fast') }}</h4>
            <p class="text-xs font-bold text-muted-foreground leading-relaxed">{{ __('website.trust.fastDesc') }}</p>
        </div>
        <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
            </div>
            <h4 class="font-black text-xs uppercase tracking-widest text-foreground">{{ __('website.trust.quality') }}</h4>
            <p class="text-xs font-bold text-muted-foreground leading-relaxed">{{ __('website.trust.qualityDesc') }}</p>
        </div>
    </section>
@endsection