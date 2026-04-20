@extends('layouts.public')

@section('seo')
    <title>Your Shopping Cart - Souk AI</title>
@endsection

@section('content')
    <div class="mb-16">
        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4 uppercase">{{ __('website.cart.title') }}</h1>
        <p class="text-muted-foreground font-medium">{{ __('website.cart.subtitle') }}</p>
    </div>

    @if(count($products) > 0)
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-6">
            @php $total = 0; @endphp
            @foreach($products as $product)
                @php 
                    $qty = $cart[$product->id];
                    $price = $product->promo > 0 ? $product->price * (1 - $product->promo/100) : $product->price;
                    $subtotal = $price * $qty;
                    $total += $subtotal;
                @endphp
                <div class="glass border border-border/40 rounded-[40px] p-6 flex flex-col md:flex-row items-center gap-6 premium-shadow">
                    <div class="w-24 h-24 rounded-3xl overflow-hidden bg-muted/20 flex-shrink-0">
                        @if($product->albums->first())
                            <img src="/storage/{{ $product->albums->first()->file }}" alt="" class="w-full h-full object-cover">
                        @else
                            <img src="/storage/empty/empty.webp" alt="" class="w-full h-full object-cover">
                        @endif
                    </div>
                    
                    <div class="flex-1 space-y-2 text-center md:text-left">
                        <p class="text-[10px] font-black uppercase tracking-widest text-primary">{{ $product->store->{'name_'.app()->getLocale()} }}</p>
                        <h3 class="font-bold text-foreground text-lg">{{ $product->{'name_'.app()->getLocale()} }}</h3>
                        <p class="text-sm font-black text-foreground">{{ number_format($price, 2) }} {{ __('website.currency') }}</p>
                    </div>

                    <div class="flex items-center gap-4">
                        <form action="{{ route('public.cart.update') }}" method="POST" class="flex items-center gap-2 bg-muted/20 p-2 rounded-2xl border border-border/20">
                            @csrf
                            <input type="hidden" name="product_id" value="{{ $product->id }}">
                            <button name="quantity" value="{{ $qty - 1 }}" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white hover:text-primary transition-all">-</button>
                            <span class="text-xs font-black min-w-[20px] text-center">{{ $qty }}</span>
                            <button name="quantity" value="{{ $qty + 1 }}" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white hover:text-primary transition-all">+</button>
                        </form>
                        
                        <form action="{{ route('public.cart.remove') }}" method="POST">
                            @csrf
                            <input type="hidden" name="product_id" value="{{ $product->id }}">
                            <button class="text-rose-500 hover:bg-rose-500/10 p-3 rounded-2xl transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </form>
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Summary -->
        <div class="space-y-6">
            <div class="bg-card glass border border-border/40 rounded-[40px] p-8 premium-shadow space-y-8 sticky top-32">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-foreground">{{ __('website.cart.title') }}</h3>
                
                <div class="space-y-4">
                    <div class="flex justify-between text-muted-foreground font-medium">
                        <span class="text-[10px] uppercase tracking-widest">{{ __('website.cart.subtotal') }}</span>
                        <span class="text-sm font-black text-foreground">{{ number_format($total, 2) }} {{ __('website.currency') }}</span>
                    </div>
                    <div class="flex justify-between text-muted-foreground font-medium">
                        <span class="text-[10px] uppercase tracking-widest">{{ __('website.cart.shipping') }}</span>
                        <span class="text-[10px] font-black uppercase text-primary">{{ __('website.cart.shippingNote') }}</span>
                    </div>
                    <div class="pt-4 border-t border-border/40 flex justify-between">
                        <span class="text-xs font-black uppercase tracking-widest text-foreground">{{ __('website.cart.total') }}</span>
                        <span class="text-xl font-black text-primary">{{ number_format($total, 2) }} {{ __('website.currency') }}</span>
                    </div>
                </div>

                <a href="{{ route('public.checkout') }}" class="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                    {{ __('website.cart.proceed') }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    </div>
    @else
    <div class="py-32 text-center space-y-8 glass rounded-[60px] border border-border/40">
        <div class="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <div class="space-y-2">
            <h3 class="text-3xl font-black text-foreground">{{ __('website.cart.empty') }}</h3>
            <p class="text-muted-foreground font-medium">{{ __('website.cart.emptyDesc') }}</p>
        </div>
        <a href="/" class="inline-block px-12 py-5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">{{ __('website.cart.start') }}</a>
    </div>
    @endif
@endsection
