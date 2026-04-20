@extends('layouts.public')

@section('seo')
    <meta name="description" content="Login to your Souk AI account.">
    <meta property="og:title" content="Login - Souk AI">
@endsection

@section('content')
<div class="flex items-center justify-center min-h-[70vh]">
    <div class="w-full max-w-md">
        <div class="glass border border-border/40 rounded-[40px] p-10 premium-shadow">
            <div class="text-center mb-10">
                <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 rotate-3">
                    <span class="text-white font-black text-3xl">S</span>
                </div>
                <h1 class="text-3xl font-black text-foreground tracking-tight mb-2">{{ __('website.login') }}</h1>
                <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">{{ __('website.welcome') }}</p>
            </div>

            <form action="{{ route('public.login.submit') }}" method="POST" class="space-y-6">
                @csrf
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">{{ __('website.checkout.email') }}</label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <input type="email" name="email" value="{{ old('email') }}" required class="w-full pl-12 pr-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background" placeholder="name@example.com">
                    </div>
                    @error('email')
                        <p class="text-rose-500 text-[10px] font-bold mt-1 ml-2">{{ $message }}</p>
                    @enderror
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Password</label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <input type="password" name="password" required class="w-full pl-12 pr-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background" placeholder="••••••••">
                    </div>
                </div>

                <div class="flex items-center justify-between px-2">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" name="remember" class="w-4 h-4 rounded-md border-border/40 bg-muted/30 text-primary focus:ring-primary/20 cursor-pointer">
                        <span class="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">Remember me</span>
                    </label>
                    <a href="#" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</a>
                </div>

                <button type="submit" class="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primaryemphasis transition-all shadow-xl shadow-primary/20 active:scale-95">
                    {{ __('website.login') }}
                </button>
            </form>

            <div class="mt-10 pt-8 border-t border-border/20 text-center">
                <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Don't have an account? 
                    <a href="{{ route('register') }}" class="text-primary font-black ml-1 hover:underline">Create one now</a>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
