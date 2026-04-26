@extends('layouts.public', ['title' => setting('contact_title_'.app()->getLocale(), __('website.pages.contactTitle'))])

@section('content')
@php
    $locale = app()->getLocale();
    $title = setting('contact_title_'.$locale, __('website.pages.contactTitle'));
    $content = setting('contact_content_'.$locale, __('website.pages.contactFallback'));
    $email = setting('contact_email', 'support@soukai.com');
    $phone = setting('contact_phone', '+216 00 000 000');
    $address = setting('contact_address_'.$locale, setting('contact_address_en', 'Tunis, Tunisia'));
    $locationUrl = setting('contact_location_url');
@endphp

<section class="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
    <div class="rounded-[40px] border border-border/40 bg-card glass p-8 md:p-12 premium-shadow">
        <p class="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">{{ __('website.pages.contactLabel') }}</p>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">{{ $title }}</h1>
        <div class="max-w-3xl text-base leading-8 text-muted-foreground whitespace-pre-line">{{ $content }}</div>
    </div>

    <div class="space-y-6">
        <div class="rounded-[32px] border border-border/40 bg-card p-6">
            <p class="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">{{ __('website.pages.email') }}</p>
            <a href="mailto:{{ $email }}" class="text-lg font-black text-foreground break-all">{{ $email }}</a>
        </div>
        <div class="rounded-[32px] border border-border/40 bg-card p-6">
            <p class="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">{{ __('website.pages.phone') }}</p>
            <a href="tel:{{ preg_replace('/\s+/', '', $phone) }}" class="text-lg font-black text-foreground">{{ $phone }}</a>
        </div>
        <div class="rounded-[32px] border border-border/40 bg-card p-6">
            <p class="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">{{ __('website.pages.location') }}</p>
            <p class="text-base font-bold text-muted-foreground leading-7">{{ $address }}</p>
            @if($locationUrl)
                <a href="{{ $locationUrl }}" target="_blank" rel="noopener noreferrer" class="inline-flex mt-4 px-5 py-3 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primaryemphasis transition-colors">
                    {{ __('website.pages.openMap') }}
                </a>
            @endif
        </div>
    </div>
</section>
@endsection
