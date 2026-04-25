@extends('layouts.public')

@section('seo')
    <title>{{ __('website.success.title') }} - Souk AI</title>
@endsection

@section('content')
    <div class="max-w-2xl mx-auto py-20 text-center">
        <div class="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10 text-green-500 scale-125">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        
        <div class="space-y-6 mb-12">
            <h1 class="text-6xl font-black text-foreground tracking-tighter">{{ __('website.success.title') }}</h1>
            <p class="text-xl text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                {{ __('website.success.message') }} <span class="text-primary font-black">#{{ $order->id }}</span> {{ __('website.success.status') }}
            </p>
            <p class="text-sm text-muted-foreground">{{ __('website.success.emailsent') }}</p>
        </div>

@if(session('guest_temp_password'))
        @php $tempPassword = session('guest_temp_password'); @endphp
        <div class="p-8 glass border border-primary/20 rounded-[40px] mb-12 text-left space-y-4 premium-shadow">
            <h3 class="text-xl font-black text-foreground flex items-center gap-3">
                 <span class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </span>
                 {{ __('website.success.welcome') }}
            </h3>
            <p class="text-sm font-bold text-muted-foreground">
                {{ __('website.success.guestWelcome') }}
            </p>
            <div class="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p class="text-xs font-black uppercase tracking-widest text-green-600 mb-2">Your Temporary Password</p>
                <p class="text-2xl font-black text-green-600 font-mono">{{ $tempPassword }}</p>
            </div>
        </div>
        @endif

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" class="px-12 py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                {{ __('website.success.continue') }}
            </a>
            <a href="/profile" class="px-12 py-5 bg-card glass border border-border/40 text-foreground rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-muted/50 transition-all">
                {{ __('website.success.viewStatus') }}
            </a>
        </div>
    </div>
@endsection
