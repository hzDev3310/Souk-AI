@extends('layouts.public')

@section('seo')
    <title>Your Favorites - Souk AI</title>
@endsection

@section('content')
    <div class="mb-16">
        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">{{ __('website.favorites.title') }}</h1>
        <p class="text-muted-foreground font-medium">{{ __('website.favorites.subtitle') }}</p>
    </div>

    @if(count($products) > 0)
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            @foreach($products as $product)
                <x-product-card :product="$product" :show-store="true" />
            @endforeach
        </div>
    @else
        <div class="py-32 text-center space-y-8 glass rounded-[60px] border border-border/40">
            <div class="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
            </div>
            <div class="space-y-2">
                <h3 class="text-3xl font-black text-foreground">{{ __('website.favorites.empty') }}</h3>
                <p class="text-muted-foreground font-medium">{{ __('website.favorites.emptyDesc') }}</p>
            </div>
            <a href="/"
                class="inline-block px-12 py-5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">{{ __('website.favorites.browse') }}</a>
        </div>
    @endif
@endsection

@push('scripts')
    <script>
        document.querySelectorAll('.toggle-favorite-form').forEach(form => {
            form.addEventListener('submit', function (e) {
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
                        if (data.success) {
                            location.reload(); // Simple way to update UI for now
                        }
                    });
            });
        });
    </script>
@endpush