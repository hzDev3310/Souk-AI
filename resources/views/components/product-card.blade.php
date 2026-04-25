@props(['product', 'showStore' => false])

<div class="product-card group relative bg-card glass border border-border/40 rounded-[40px] overflow-hidden premium-shadow">
    {{-- Promo Badge --}}
    @if($product->promo > 0)
    <div class="absolute top-5 left-5 z-20 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-rose-500/30">
        -{{ $product->promo }}%
    </div>
    @endif
    
    {{-- Product Image --}}
    <div class="relative aspect-square overflow-hidden bg-muted/20">
        @if($product->albums->first())
            <img src="/storage/{{ $product->albums->first()->file }}" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
        @else
            <img src="/storage/empty/empty.webp" alt="{{ $product->{'name_'.app()->getLocale()} }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
        @endif
        
        <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {{-- Quick View Button --}}
        <div class="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <a href="{{ route('public.product', $product->slug) }}" class="w-full py-3 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                {{ __('website.quickView') }}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
        </div>
    </div>

    {{-- Product Info --}}
    <div class="p-4 md:p-6 space-y-2 md:space-y-3">
        {{-- Store Name (optional) --}}
        @if($showStore && $product->store)
        <p class="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary">{{ $product->store->{'name_'.app()->getLocale()} }}</p>
        @endif
        
        {{-- Product Name --}}
        <h3 class="font-bold text-foreground text-[10px] md:text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {{ $product->{'name_'.app()->getLocale()} }}
        </h3>

        {{-- Price --}}
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
        </div>
    </div>
</div>
