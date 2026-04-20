@extends('layouts.public')

@section('seo')
    <title>Edit Profile - Souk AI</title>
@endsection

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="mb-12">
        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">Edit Profile</h1>
        <p class="text-muted-foreground font-medium text-lg">Update your personal information and delivery address</p>
    </div>

    @if(session('success'))
        <div class="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl font-bold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            {{ session('success') }}
        </div>
    @endif

    <div class="glass border border-border/40 rounded-[40px] p-8 md:p-12 premium-shadow">
        <form action="{{ route('public.profile.update') }}" method="POST" class="space-y-8">
            @csrf
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">First Name</label>
                    <input type="text" name="name" value="{{ old('name', $user->name) }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Name</label>
                    <input type="text" name="family_name" value="{{ old('family_name', $user->family_name) }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background">
                </div>
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address (Cannot be changed)</label>
                <input type="email" value="{{ $user->email }}" disabled class="w-full px-6 py-4 bg-muted/10 border border-border/20 rounded-2xl text-muted-foreground font-bold text-sm cursor-not-allowed">
            </div>

            <div class="pt-8 border-t border-border/20">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                    Delivery Information
                </h3>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Street Address</label>
                        <input type="text" name="address" value="{{ old('address', $client->address ?? '') }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">City</label>
                            <input type="text" name="city" value="{{ old('city', $client->city ?? '') }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Postal Code</label>
                            <input type="text" name="codePostal" value="{{ old('codePostal', $client->codePostal ?? '') }}" required class="w-full px-6 py-4 bg-muted/30 border border-border/40 rounded-2xl text-foreground font-bold text-sm focus:border-primary outline-none transition-all focus:bg-background">
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-8">
                <button type="submit" class="px-12 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primaryemphasis transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0">
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
