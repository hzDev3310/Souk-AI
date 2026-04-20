@extends('layouts.public')

@section('seo')
    <title>Your Favorites - Souk AI</title>
@endsection

@section('content')
    <div class="mb-16">
        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">Favorites</h1>
        <p class="text-muted-foreground font-medium">Items you've saved for later.</p>
    </div>

    @if(count($products) > 0)
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
                
                <form action="{{ route('public.favorites.toggle') }}" method="POST" class="absolute top-4 right-4 z-20 toggle-favorite-form">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                    <button type="submit" class="w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 hover:scale-110 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                </form>
            </div>
            <div class="p-4 md:p-6">
                <p class="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary mb-2 text-primary">{{ $product->store->name_en }}</p>
                <h3 class="font-bold text-foreground text-[10px] md:text-sm line-clamp-1 mb-3">{{ $product->name_en }}</h3>
                <p class="text-sm md:text-lg font-black text-foreground">{{ number_format($product->price, 2) }} <span class="text-[8px] md:text-[10px] text-muted-foreground ml-1">TND</span></p>
            </div>
        </div>
        @endforeach
    </div>
    @else
    <div class="py-32 text-center space-y-8 glass rounded-[60px] border border-border/40">
        <div class="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
        <div class="space-y-2">
            <h3 class="text-3xl font-black text-foreground">No favorites yet</h3>
            <p class="text-muted-foreground font-medium">Save items you love to find them easily here.</p>
        </div>
        <a href="/" class="inline-block px-12 py-5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">Browse Products</a>
    </div>
    @endif
@endsection

@push('scripts')
<script>
    document.querySelectorAll('.toggle-favorite-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    location.reload(); // Simple way to update UI for now
                }
            });
        });
    });
</script>
@endpush
