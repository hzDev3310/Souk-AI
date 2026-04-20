@extends('layouts.public')

@section('seo')
    <title>Search Results for "{{ $query }}" - Souk AI</title>
    <meta name="description" content="Search results for {{ $query }} on Souk AI premium marketplace.">
@endsection

@section('content')
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Sidebar -->
        <aside class="space-y-10">
            <div class="glass border border-border/40 rounded-[40px] p-8 premium-shadow sticky top-32">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                    {{ __('website.categories') }}
                </h3>
                
                <nav class="space-y-2">
                    @foreach($categories as $cat)
                    <div class="space-y-1">
                        <a href="{{ route('public.category', $cat->slug) }}" 
                           class="flex items-center justify-between group p-3 rounded-2xl transition-all text-muted-foreground hover:bg-muted/30 hover:text-foreground">
                            <span class="text-xs font-bold uppercase tracking-wider">{{ $cat->{'name_'.app()->getLocale()} }}</span>
                            @if($cat->children->count() > 0)
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-90"><path d="m9 18 6-6-6-6"/></svg>
                            @endif
                        </a>
                    </div>
                    @endforeach
                </nav>
            </div>
            
            <div class="bg-card glass border border-border/40 rounded-[40px] p-8 premium-shadow">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{{ __('website.search.tips') }}</h4>
                <ul class="text-[10px] font-bold text-muted-foreground space-y-2 list-disc pl-4">
                    <li>{{ __('website.search.tip1') }}</li>
                    <li>{{ __('website.search.tip2') }}</li>
                    <li>{{ __('website.search.tip3') }}</li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="lg:col-span-3">
            <div class="mb-16">
                <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
                    <a href="/" class="hover:text-primary transition-colors">{{ __('website.nav.home') }}</a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    <span class="text-foreground">{{ __('website.search.resultsFor') }}</span>
                </nav>

                <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">
                    {{ __('website.search.resultsFor') }} <span class="text-primary italic">"{{ $query }}"</span>
                </h1>
                <p class="text-muted-foreground font-medium">
                    {{ __('website.search.found') }} {{ $products->total() }} {{ __('website.search.matching') }}
                </p>
            </div>

            @if($products->count() > 0)
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                @foreach($products as $product)
                <div class="product-card group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow">
                    <div class="relative aspect-square overflow-hidden bg-muted/20">
                        @if($product->albums->first())
                            <img src="/storage/{{ $product->albums->first()->file }}" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        @else
                            <img src="/storage/empty/empty.webp" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        @endif
                        <div class="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 z-20">
                            <a href="{{ route('public.product', $product->slug) }}" class="w-full py-3 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                                {{ __('website.quickView') }}
                            </a>
                        </div>
                    </div>
                    <div class="p-4 md:p-6">
                        <p class="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary mb-2">{{ $product->store->{'name_'.app()->getLocale()} }}</p>
                        <h3 class="font-bold text-foreground text-[10px] md:text-sm line-clamp-1 mb-3">{{ $product->{'name_'.app()->getLocale()} }}</h3>
                        <p class="text-sm md:text-lg font-black text-foreground">{{ number_format($product->price, 2) }} <span class="text-[8px] md:text-[10px] text-muted-foreground ml-1">{{ __('website.currency') }}</span></p>
                    </div>
                </div>
                @endforeach
            </div>

            <div class="mt-16 flex justify-center">
                {{ $products->appends(['q' => $query])->links() }}
            </div>
            @else
            <div class="py-20 text-center space-y-6 glass rounded-[40px] border border-border/40">
                <div class="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
                </div>
                <div class="space-y-2">
                    <h3 class="text-2xl font-black text-foreground">{{ __('website.search.noMatches') }}</h3>
                    <p class="text-muted-foreground font-medium">{{ __('website.search.noMatchesDesc') }} "{{ $query }}".</p>
                </div>
                <a href="/" class="inline-block px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primaryemphasis transition-all">{{ __('website.search.explore') }}</a>
            </div>
            @endif
        </div>
    </div>
@endsection
