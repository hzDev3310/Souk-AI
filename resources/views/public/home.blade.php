@extends('layouts.public')

@section('seo')
    <meta name="description" content="Discover premium products on Souk AI. The ultimate marketplace for quality-conscious shoppers.">
    <meta name="keywords" content="marketplace, shoppping, souk, ai, products, premium">
    <meta property="og:title" content="Souk AI - Premium Marketplace">
    <meta property="og:description" content="Discover premium products on Souk AI.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
@endsection

@section('content')
    <!-- Hero Section -->
    <section class="relative h-[480px] rounded-[60px] overflow-hidden mb-16 shadow-2xl shadow-primary/10">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/90 via-primaryemphasis to-main-bg-dark z-10 opacity-90"></div>
        <img src="{{ setting('hero_image') ? (str_starts_with(setting('hero_image'), 'http') ? setting('hero_image') : '/storage/'.setting('hero_image')) : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' }}" class="absolute inset-0 w-full h-full object-cover">
        
        <div class="relative z-20 h-full flex flex-col justify-center items-start px-12 md:px-24 max-w-4xl space-y-8">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border-blue-400/20 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                {{ __('website.specialOffer') }}
            </div>
            
            <h1 class="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
                {!! preg_replace('/\*(.*?)\*/', '<span class="text-secondary">$1</span>', setting('hero_title_'.app()->getLocale(), __('website.heroTitle'))) !!}
            </h1>
            
            <p class="text-lg text-white/80 font-medium max-w-xl leading-relaxed">
                {{ setting('hero_subtitle_'.app()->getLocale(), __('website.heroSubtitle')) }}
            </p>

            <div class="flex flex-wrap gap-4 pt-4">
                <a href="#section-1" class="px-8 py-4 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/10">
                    {{ __('website.exploreCollection') }}
                </a>
                <a href="/register" class="px-8 py-4 glass text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border-white/20">
                    {{ __('website.joinAsSeller') }}
                </a>
            </div>
        </div>
    </section>

    <!-- SECTION 1: Top Products by Orders -->
    <section id="section-1" class="mb-20">
        <div class="flex items-center justify-between mb-10 px-4">
            <div>
                <h2 class="text-3xl font-black text-foreground tracking-tight">{{ __('website.featuredProducts') }}</h2>
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">{{ __('website.trending') }}</p>
            </div>
            <a href="{{ route('public.all-products', ['sort' => 'orders']) }}" class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            @forelse($topProducts as $product)
            <div class="product-card group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow">
                @if($product->promo > 0)
                <div class="absolute top-5 left-5 z-20 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-rose-500/30">
                    -{{ $product->promo }}%
                </div>
                @endif
                
                <div class="relative aspect-square overflow-hidden bg-muted/20">
                    @if($product->albums->first())
                        <img src="/storage/{{ $product->albums->first()->file }}" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    @else
                        <img src="/storage/empty/empty.webp" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    @endif
                    
                    <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div class="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <a href="{{ route('public.product', $product->slug) }}" class="w-full py-3 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                            {{ __('website.quickView') }}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>

                <div class="p-4 md:p-6 space-y-2 md:space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {{ $product->store->{'name_'.app()->getLocale()} }}
                        </span>
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span class="text-[10px] font-black text-foreground">4.9</span>
                        </div>
                    </div>

                    <h3 class="font-bold text-foreground text-[10px] md:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {{ $product->{'name_'.app()->getLocale()} }}
                    </h3>

                    <div class="flex items-end justify-between pt-2">
                        <div class="space-y-0.5">
                            @if($product->promo > 0)
                            <p class="text-[10px] text-muted-foreground font-bold line-through">
                                {{ number_format($product->price, 2) }} {{ __('website.currency') }}
                            </p>
                            @endif
                            <p class="text-lg font-black text-foreground">
                                @if($product->promo > 0)
                                    {{ number_format($product->price * (1 - $product->promo/100), 2) }}
                                @else
                                    {{ number_format($product->price, 2) }}
                                @endif
                                <span class="text-[10px] font-black text-muted-foreground uppercase ml-1">{{ __('website.currency') }}</span>
                            </p>
                        </div>
                        
                        <button class="w-10 h-10 bg-muted/30 rounded-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        </button>
                    </div>
                </div>
            </div>
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
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">{{ __('website.categories') }}</p>
            </div>
            <a href="{{ route('public.all-categories') }}" class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @forelse($topCategories as $category)
            <a href="{{ route('public.category', $category->slug) }}" class="group block p-6 bg-card glass border border-border/40 rounded-[32px] text-center hover:bg-primary transition-all active:scale-95 premium-shadow">
                <div class="w-16 h-16 bg-muted/40 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:scale-110 transition-all">
                    @if($category->icon && file_exists(public_path($category->icon)))
                        <img src="{{ asset($category->icon) }}" alt="" class="w-8 h-8 object-contain group-hover:brightness-0 group-hover:invert">
                    @else
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary group-hover:text-white transition-colors"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    @endif
                </div>
                <h4 class="font-black text-[10px] uppercase tracking-widest text-foreground group-hover:text-white transition-colors">
                    {{ $category->{'name_'.app()->getLocale()} }}
                </h4>
            </a>
            @empty
            <div class="col-span-2 md:col-span-3 lg:col-span-4 py-10 text-center text-muted-foreground">
                No categories found
            </div>
            @endforelse
        </div>
    </section>

    <!-- SECTION 3: Top Stores by Orders -->
    <section class="mb-20">
        <div class="flex items-center justify-between mb-10 px-4">
            <div>
                <h2 class="text-3xl font-black text-foreground tracking-tight">{{ __('website.bestStores') ?? 'Best Stores' }}</h2>
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">{{ __('website.topSellers') ?? 'Top Sellers' }}</p>
            </div>
            <a href="{{ route('public.all-stores') }}" class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            @forelse($topStores as $store)
            <div class="group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow hover:shadow-2xl hover:shadow-primary/20 transition-all">
                @if($store->cover)
                <div class="h-24 overflow-hidden bg-muted/20 group-hover:scale-110 transition-transform duration-700">
                    <img src="{{ asset($store->cover) }}" alt="" class="w-full h-full object-cover">
                </div>
                @else
                <div class="h-24 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                @endif
                
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-3">
                        @if($store->logo && file_exists(public_path($store->logo)))
                            <img src="{{ asset($store->logo) }}" alt="" class="w-12 h-12 rounded-full object-cover border-2 border-primary/20">
                        @else
                            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                                {{ substr($store->{'name_'.app()->getLocale()}, 0, 1) }}
                            </div>
                        @endif
                        <div class="flex-1">
                            <h4 class="font-black text-sm text-foreground line-clamp-1">
                                {{ $store->{'name_'.app()->getLocale()} }}
                            </h4>
                            <p class="text-[10px] text-muted-foreground font-bold">{{ $store->products->count() }} {{ __('website.products') ?? 'Products' }}</p>
                        </div>
                    </div>
                    <p class="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {{ $store->{'description_'.app()->getLocale()} }}
                    </p>
                    <a href="{{ route('public.all-products', ['store_id' => $store->id]) }}" class="w-full py-2 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primaryemphasis transition-all text-center">
                        {{ __('website.visit') ?? 'Visit' }}
                    </a>
                </div>
            </div>
            @empty
            <div class="col-span-2 lg:col-span-4 py-10 text-center text-muted-foreground">
                No stores found
            </div>
            @endforelse
        </div>
    </section>

    <!-- SECTION 4: Latest Products (Recent Additions) -->
    <section class="mb-20">
        <div class="flex items-center justify-between mb-10 px-4">
            <div>
                <h2 class="text-3xl font-black text-foreground tracking-tight">{{ __('website.latestProducts') ?? 'Latest Products' }}</h2>
                <p class="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">{{ __('website.recentAdditions') ?? 'Recently Added' }}</p>
            </div>
            <a href="{{ route('public.all-products', ['sort' => 'latest']) }}" class="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
                {{ __('website.viewAll') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            @forelse($recentProducts as $product)
            <div class="product-card group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow">
                <div class="relative aspect-square overflow-hidden bg-muted/20">
                    @if($product->albums->first())
                        <img src="/storage/{{ $product->albums->first()->file }}" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    @else
                        <img src="/storage/empty/empty.webp" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    @endif
                    
                    <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div class="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <a href="{{ route('public.product', $product->slug) }}" class="w-full py-3 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                            {{ __('website.quickView') }}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>

                <div class="p-4 md:p-6 space-y-2 md:space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {{ $product->store->{'name_'.app()->getLocale()} }}
                        </span>
                    </div>

                    <h3 class="font-bold text-foreground text-[10px] md:text-sm line-clamp-1">
                        {{ $product->{'name_'.app()->getLocale()} }}
                    </h3>

                    <p class="text-lg font-black text-foreground">
                        {{ number_format($product->price, 2) }}
                        <span class="text-[10px] font-black text-muted-foreground uppercase ml-1">{{ __('website.currency') }}</span>
                    </p>
                </div>
            </div>
            @empty
            <div class="col-span-2 lg:col-span-4 py-10 text-center text-muted-foreground">
                {{ __('website.noProductsCategory') }}
            </div>
            @endforelse
        </div>
    </section>

    <!-- Trust Banner -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-card glass border border-border/40 rounded-[60px] premium-shadow">
        <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
            </div>
            <h4 class="font-black text-xs uppercase tracking-widest text-foreground">{{ __('website.trust.secure') }}</h4>
            <p class="text-xs font-bold text-muted-foreground leading-relaxed">{{ __('website.trust.secureDesc') }}</p>
        </div>
        <div class="flex flex-col items-center text-center space-y-4">
             <div class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 10-6-6-6 6"/><path d="M22 10 16 16"/><path d="M6 14h16"/></svg>
            </div>
            <h4 class="font-black text-xs uppercase tracking-widest text-foreground">{{ __('website.trust.fast') }}</h4>
            <p class="text-xs font-bold text-muted-foreground leading-relaxed">{{ __('website.trust.fastDesc') }}</p>
        </div>
        <div class="flex flex-col items-center text-center space-y-4">
             <div class="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h4 class="font-black text-xs uppercase tracking-widest text-foreground">{{ __('website.trust.quality') }}</h4>
            <p class="text-xs font-bold text-muted-foreground leading-relaxed">{{ __('website.trust.qualityDesc') }}</p>
        </div>
    </section>
@endsection
