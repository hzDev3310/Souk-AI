@extends('layouts.public')

@section('seo')
    <meta name="description" content="Browse all stores on Souk AI marketplace.">
    <meta name="keywords" content="stores, marketplace, shopping">
    <meta property="og:title" content="All Stores - Souk AI">
    <meta property="og:url" content="{{ url()->current() }}">
@endsection

@section('content')
    <div class="mb-12">
        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">{{ __('website.allStores') ?? 'All Stores' }}</h1>
        <p class="text-muted-foreground font-medium text-lg">{{ __('website.bestStores') ?? 'Discover our top sellers and stores' }}</p>
    </div>

    <!-- Stores Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
        @forelse($stores as $store)
        <div class="group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 flex flex-col">
            @if($store->cover)
            <div class="h-32 overflow-hidden bg-muted/20 relative">
                <img src="/storage/{{ $store->cover }}" alt="" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            @else
            <div class="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 relative overflow-hidden">
                <div class="absolute inset-0 bg-black/5"></div>
            </div>
            @endif
            
            <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center gap-3 mb-6 relative">
                    <div class="absolute -top-14 left-0">
                        @if($store->logo)
                            <img src="/storage/{{ $store->logo }}" alt="" class="w-20 h-20 rounded-[24px] object-cover border-4 border-card bg-card shadow-xl group-hover:rotate-12 transition-transform duration-500">
                        @else
                            <div class="w-20 h-20 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary font-black border-4 border-card bg-card shadow-xl group-hover:rotate-12 transition-transform duration-500 text-3xl">
                                {{ substr($store->{'name_'.app()->getLocale()}, 0, 1) }}
                            </div>
                        @endif
                    </div>
                </div>
                
                <div class="mt-8 flex flex-col flex-1">
                    <div class="flex items-start justify-between gap-2 mb-4">
                        <div class="flex-1">
                            <h4 class="font-black text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {{ $store->{'name_'.app()->getLocale()} }}
                            </h4>
                            <div class="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                                <span>{{ $store->products->count() }} {{ __('website.products') ?? 'Products' }}</span>
                                <span class="w-1 h-1 rounded-full bg-border"></span>
                                <span class="flex items-center gap-1 text-amber-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    4.9
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-1">
                        {{ $store->{'description_'.app()->getLocale()} ?? 'Discover amazing products from '.$store->{'name_'.app()->getLocale()} }}
                    </p>
                    
                    <a href="{{ route('public.store', $store->slug) }}" class="w-full py-3.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 text-center flex justify-center items-center gap-2 group/btn">
                        {{ __('website.visit') ?? 'Visit Store' }}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 py-20 text-center space-y-4 glass rounded-[40px] border border-border/40">
            <div class="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
            </div>
            <p class="text-muted-foreground font-bold uppercase tracking-widest text-xs">{{ __('website.noStoresFound') }}</p>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    <div class="mt-16 flex justify-center">
        {{ $stores->links() }}
    </div>
@endsection
