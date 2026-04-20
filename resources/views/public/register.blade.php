@extends('layouts.public')

@section('seo')
    <meta name="description" content="Join Souk AI today.">
    <meta property="og:title" content="Register - Souk AI">
@endsection

@section('content')
<div class="flex items-center justify-center min-h-[80vh]">
    <div class="w-full max-w-lg">
        <div class="glass border border-border/40 rounded-[40px] p-10 premium-shadow">
            <div class="text-center mb-10">
                <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 -rotate-3">
                    <span class="text-white font-black text-3xl">S</span>
                </div>
                <h1 class="text-3xl font-black text-foreground tracking-tight mb-2">Create Account</h1>
                <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">Join our premium marketplace</p>
            </div>

            <form action="{{ route('public.register.submit') }}" method="POST" class="space-y-6">
                @csrf
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">First Name</label>
                        <input type="text" name="name" value="{{ old('name') }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background" placeholder="John">
                        @error('name')
                            <p class="text-rose-500 text-[10px] font-bold mt-1 ml-2">{{ $message }}</p>
                        @enderror
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Last Name</label>
                        <input type="text" name="family_name" value="{{ old('family_name') }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background" placeholder="Doe">
                        @error('family_name')
                            <p class="text-rose-500 text-[10px] font-bold mt-1 ml-2">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Email Address</label>
                    <input type="email" name="email" value="{{ old('email') }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background" placeholder="john@example.com">
                    @error('email')
                        <p class="text-rose-500 text-[10px] font-bold mt-1 ml-2">{{ $message }}</p>
                    @enderror
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Password</label>
                        <input type="password" name="password" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background" placeholder="••••••••">
                        @error('password')
                            <p class="text-rose-500 text-[10px] font-bold mt-1 ml-2">{{ $message }}</p>
                        @enderror
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Confirm Password</label>
                        <input type="password" name="password_confirmation" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background" placeholder="••••••••">
                    </div>
                </div>

                <div class="px-2">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" required class="w-5 h-5 rounded-md border-border/40 bg-muted/30 text-primary focus:ring-primary/20 cursor-pointer">
                        <span class="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest leading-relaxed">I agree to the Terms of Service and Privacy Policy</span>
                    </label>
                </div>

                <button type="submit" class="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primaryemphasis transition-all shadow-xl shadow-primary/20 active:scale-95">
                    Create Account
                </button>
            </form>

            <div class="mt-10 pt-8 border-t border-border/20 text-center">
                <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Already have an account? 
                    <a href="{{ route('login') }}" class="text-primary font-black ml-1 hover:underline">{{ __('website.login') }}</a>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
