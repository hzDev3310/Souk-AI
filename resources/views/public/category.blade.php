@extends('layouts.public')

@section('seo')
    <meta name="description" content="Explore products in {{ $category->name_en }} on Souk AI.">
    <meta name="keywords" content="{{ $category->name_en }}, marketplace, souk">
    <meta property="og:title" content="{{ $category->name_en }} - Souk AI">
    <meta property="og:description" content="Explore products in {{ $category->name_en }} on Souk AI.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
@endsection

@section('content')
    <div class="mb-16">
        <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
            <a href="/" class="hover:text-primary transition-colors">Home</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            <span class="text-foreground">Categories</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            <span class="text-primary">{{ $category->name_en }}</span>
        </nav>

        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">
            {{ $category->name_en }}
        </h1>
        <p class="text-muted-foreground font-medium max-w-2xl">
            Showing all premium items curated for the {{ $category->name_en }} collection.
        </p>
    </div>

    @if($products->count() > 0)
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        @foreach($products as $product)
        <div class="product-card group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow">
            <div class="relative aspect-square overflow-hidden bg-muted/20">
                @if($product->albums->first())
                    <img src="/storage/{{ $product->albums->first()->file }}" alt="{{ $product->name_en }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                @else
                    <img src="/storage/empty/empty.webp" alt="{{ $product->name_en }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                @endif
                <div class="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <a href="{{ route('public.product', $product->slug) }}" class="w-full py-3 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                        Quick View
                    </a>
                </div>
            </div>
            <div class="p-6">
                <p class="text-[9px] font-black uppercase tracking-widest text-primary mb-2">{{ $product->store->name_en }}</p>
                <h3 class="font-bold text-foreground text-sm line-clamp-1 mb-3">{{ $product->name_en }}</h3>
                <p class="text-lg font-black text-foreground">{{ number_format($product->price, 2) }} <span class="text-[10px] text-muted-foreground ml-1">TND</span></p>
            </div>
        </div>
        @endforeach
    </div>

    <div class="mt-16 flex justify-center">
        {{ $products->links() }}
    </div>
    @else
    <div class="py-20 text-center space-y-4 glass rounded-[40px] border border-border/40">
        <div class="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
        </div>
        <p class="text-muted-foreground font-bold uppercase tracking-widest text-xs">No products found in this category</p>
        <a href="/" class="inline-block px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Back to Home</a>
    </div>
    @endif
@endsection
