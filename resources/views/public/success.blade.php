@extends('layouts.public')

@section('seo')
    <title>Order Confirmed - Souk AI</title>
@endsection

@section('content')
    <div class="py-32 text-center space-y-8 glass rounded-[60px] border border-border/40 premium-shadow">
        <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        
        <div class="space-y-4 max-w-xl mx-auto px-6">
            <h1 class="text-5xl font-black text-foreground tracking-tight">Order Confirmed!</h1>
            <p class="text-xl text-muted-foreground font-medium">Thank you for your purchase. Your order <span class="text-primary font-black">#{{ $order->order_number }}</span> is being processed.</p>
            
            <div class="pt-8 space-y-4">
                <p class="text-sm text-muted-foreground">A confirmation email has been sent to your inbox. You can track your order status in your profile.</p>
                @if(!Auth::check())
                    <div class="bg-primary/5 p-6 rounded-3xl border border-primary/20">
                        <p class="text-xs font-black uppercase text-primary mb-2">Welcome to Souk AI</p>
                        <p class="text-sm text-foreground">We've created an account for you. Check your email for your temporary password to log in and track your orders.</p>
                    </div>
                @endif
            </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <a href="/" class="px-12 py-5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">Continue Shopping</a>
            <a href="/login" class="px-12 py-5 glass border border-border/40 text-foreground rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-card transition-all">View Order Status</a>
        </div>
    </div>
@endsection
