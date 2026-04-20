@extends('layouts.public')

@section('seo')
    <meta name="description" content="{{ $product->description_en }}">
    <meta name="keywords" content="{{ $product->name_en }}, {{ $product->store->name_en }}, buy">
    <meta property="og:title" content="{{ $product->name_en }} - Souk AI">
    <meta property="og:description" content="{{ $product->description_en }}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="{{ url()->current() }}">
    @if($product->albums->first())
    <meta property="og:image" content="{{ asset('storage/'.$product->albums->first()->file) }}">
    @endif
@endsection

@section('content')
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
        <!-- Image Gallery -->
        <div class="space-y-6">
            <div class="relative aspect-square bg-card glass border border-border/40 rounded-[60px] overflow-hidden premium-shadow">
                @if($product->albums->first())
                    <img src="/storage/{{ $product->albums->first()->file }}" alt="{{ $product->name_en }}" class="w-full h-full object-cover">
                @else
                    <img src="/storage/empty/empty.webp" alt="{{ $product->name_en }}" class="w-full h-full object-cover">
                @endif
            </div>
            
            <div class="flex gap-4">
                @if($product->albums->count() > 0)
                    @foreach($product->albums as $album)
                        <div class="w-24 h-24 bg-card glass border border-border/40 rounded-3xl overflow-hidden cursor-pointer hover:border-primary transition-colors">
                            <img src="/storage/{{ $album->file }}" class="w-full h-full object-cover">
                        </div>
                    @endforeach
                @else
                    <div class="w-24 h-24 bg-card glass border border-border/40 rounded-3xl overflow-hidden">
                        <img src="/storage/empty/empty.webp" class="w-full h-full object-cover">
                    </div>
                @endif
            </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-8 py-4">
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                        {{ $product->store->name_en }}
                    </span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        ID: {{ substr($product->id, 0, 8) }}
                    </span>
                </div>
                
                <h1 class="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                    {{ $product->{'name_'.app()->getLocale()} }}
                </h1>
                
                <div class="flex items-center gap-6">
                    <p class="text-4xl font-black text-primary">
                        @if($product->promo > 0)
                            {{ number_format($product->price * (1 - $product->promo/100), 2) }}
                        @else
                            {{ number_format($product->price, 2) }}
                        @endif
                        <span class="text-xs font-black text-muted-foreground uppercase ml-1">TND</span>
                    </p>
                    @if($product->promo > 0)
                        <p class="text-xl font-bold text-muted-foreground line-through opacity-50 pt-2">
                             {{ number_format($product->price, 2) }} TND
                        </p>
                        <span class="px-2 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                            -{{ $product->promo }}% OFF
                        </span>
                    @endif
                </div>
            </div>

            <div class="space-y-4">
                <h4 class="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</h4>
                <p class="text-muted-foreground font-medium leading-relaxed">
                    {{ $product->{'description_'.app()->getLocale()} }}
                </p>
            </div>

            @if($product->variants->count() > 0)
            <div class="space-y-4">
                <h4 class="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Select Variant</h4>
                <div class="flex flex-wrap gap-2">
                    @foreach($product->variants as $variant)
                        <button class="px-5 py-3 glass border-border/40 rounded-2xl font-bold text-xs hover:border-primary hover:text-primary transition-all active:scale-95">
                            {{ $variant->variant_name }}
                        </button>
                    @endforeach
                </div>
            </div>
            @endif

            <div class="pt-8 flex flex-col sm:flex-row gap-4">
                <button class="flex-1 py-5 bg-primary text-white rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-primaryemphasis transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    {{ __('website.addToCart') }}
                </button>
                <button class="w-16 h-16 glass border-border/40 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-2 gap-4 pt-8">
                <div class="p-4 bg-muted/20 border border-border/20 rounded-3xl">
                    <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Authenticity</p>
                    <p class="text-xs font-bold">100% Genuine</p>
                </div>
                <div class="p-4 bg-muted/20 border border-border/20 rounded-3xl">
                    <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Store Verified</p>
                    <p class="text-xs font-bold">Trusted Seller</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Related Products -->
    @if($relatedProducts->count() > 0)
    <section class="mt-32">
        <h2 class="text-3xl font-black text-foreground tracking-tight mb-12">More from this Store</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @foreach($relatedProducts as $related)
            <div class="product-card group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow">
                <div class="relative aspect-square overflow-hidden bg-muted/20">
                    @if($related->albums->first())
                        <img src="/storage/{{ $related->albums->first()->file }}" class="w-full h-full object-cover">
                    @else
                        <img src="/storage/empty/empty.webp" class="w-full h-full object-cover">
                    @endif
                    <a href="{{ route('public.product', $related->slug) }}" class="absolute inset-0 z-10"></a>
                </div>
                <div class="p-6">
                    <h3 class="font-bold text-foreground text-sm truncate">{{ $related->name_en }}</h3>
                    <p class="text-lg font-black text-primary mt-2">{{ number_format($related->price, 2) }} TND</p>
                </div>
            </div>
            @endforeach
        </div>
    </section>
    @endif
@endsection
