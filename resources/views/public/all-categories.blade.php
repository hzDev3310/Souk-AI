@extends('layouts.public')

@section('seo')
    <meta name="description" content="Browse all categories on Souk AI marketplace.">
    <meta name="keywords" content="categories, marketplace, shopping">
    <meta property="og:title" content="All Categories - Souk AI">
    <meta property="og:url" content="{{ url()->current() }}">
@endsection

@section('content')
    <div class="mb-12">
        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">{{ __('website.allCategories') ?? 'All Categories' }}</h1>
        <p class="text-muted-foreground font-medium text-lg">{{ __('website.browseByCategory') ?? 'Browse our products by category' }}</p>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
        @forelse($categories as $category)
        <a href="{{ route('public.category', $category->slug) }}" class="group block p-8 bg-card glass border border-border/40 rounded-[40px] text-center hover:bg-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 premium-shadow relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-white/10 group-hover:to-transparent transition-colors duration-500"></div>
            
            <div class="w-20 h-20 bg-muted/40 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                @if($category->icon && file_exists(public_path($category->icon)))
                    <img src="{{ asset($category->icon) }}" alt="" class="w-10 h-10 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-500">
                @else
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary group-hover:text-white transition-colors duration-500"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                @endif
            </div>
            
            <h4 class="font-black text-sm uppercase tracking-widest text-foreground group-hover:text-white transition-colors duration-300">
                {{ $category->{'name_'.app()->getLocale()} }}
            </h4>
            
            @if($category->children->count() > 0)
                <p class="text-[10px] font-bold tracking-wider text-muted-foreground mt-3 group-hover:text-white/80 transition-colors duration-300">
                    {{ $category->children->count() }} {{ __('website.subcategories') ?? 'Subcategories' }}
                </p>
            @endif
        </a>
        @empty
        <div class="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 py-20 text-center space-y-4 glass rounded-[40px] border border-border/40">
            <div class="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
            </div>
            <p class="text-muted-foreground font-bold uppercase tracking-widest text-xs">{{ __('website.noCategoriesFound') }}</p>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    <div class="mt-16 flex justify-center">
        {{ $categories->links() }}
    </div>
@endsection
