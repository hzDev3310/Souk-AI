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
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Sidebar -->
        <aside class="space-y-10">
            <div class="glass border border-border/40 rounded-[40px] p-8 premium-shadow sticky top-32">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                    Explore Categories
                </h3>
                
                <nav class="space-y-2">
                    @foreach($categories as $cat)
                    <div class="space-y-1">
                        <a href="{{ route('public.category', $cat->slug) }}" 
                           class="flex items-center justify-between group p-3 rounded-2xl transition-all {{ $category->id == $cat->id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground' }}">
                            <span class="text-xs font-bold uppercase tracking-wider">{{ $cat->name_en }}</span>
                            @if($cat->children->count() > 0)
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-90 {{ $category->id == $cat->id || $category->parent_id == $cat->id ? 'rotate-90' : '' }}"><path d="m9 18 6-6-6-6"/></svg>
                            @endif
                        </a>
                        
                        @if($cat->children->count() > 0 && ($category->id == $cat->id || $category->parent_id == $cat->id))
                        <div class="pl-4 space-y-1 mt-1 animate-in slide-in-from-left-2 duration-300">
                            @foreach($cat->children as $child)
                            <a href="{{ route('public.category', $child->slug) }}" 
                               class="flex items-center gap-2 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all {{ $category->id == $child->id ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5' }}">
                                <span class="w-1.5 h-1.5 rounded-full {{ $category->id == $child->id ? 'bg-primary' : 'bg-border' }}"></span>
                                {{ $child->name_en }}
                            </a>
                            @endforeach
                        </div>
                        @endif
                    </div>
                    @endforeach
                </nav>
            </div>

            <!-- Promotion or Newsletter Widget -->
            <div class="bg-primary/90 rounded-[40px] p-8 text-white space-y-4 premium-shadow relative overflow-hidden group">
                <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 class="text-xl font-black leading-tight">Join our VIP collection</h4>
                <p class="text-[10px] font-bold text-white/80 uppercase tracking-widest leading-relaxed">Get early access to exclusive premium drops.</p>
                <button class="w-full py-3 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl shadow-black/10">Subscribe Now</button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="lg:col-span-3">
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
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                    <div class="p-4 md:p-6">
                        <p class="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary mb-2 text-primary">{{ $product->store->name_en }}</p>
                        <h3 class="font-bold text-foreground text-[10px] md:text-sm line-clamp-1 mb-3">{{ $product->name_en }}</h3>
                        <p class="text-sm md:text-lg font-black text-foreground">{{ number_format($product->price, 2) }} <span class="text-[8px] md:text-[10px] text-muted-foreground ml-1">TND</span></p>
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
        </div>
    </div>
@endsection
