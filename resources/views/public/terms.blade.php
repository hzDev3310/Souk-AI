@extends('layouts.public', ['title' => setting('terms_title_'.app()->getLocale(), __('website.pages.termsTitle'))])

@section('content')
@php
    $locale = app()->getLocale();
    $title = setting('terms_title_'.$locale, __('website.pages.termsTitle'));
    $content = setting('terms_content_'.$locale, __('website.pages.termsFallback'));
@endphp

<section class="max-w-5xl mx-auto">
    <div class="rounded-[40px] border border-border/40 bg-card glass p-8 md:p-12 premium-shadow">
        <p class="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">{{ __('website.pages.legal') }}</p>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">{{ $title }}</h1>
        <div class="max-w-3xl text-base leading-8 text-muted-foreground whitespace-pre-line">{{ $content }}</div>
    </div>
</section>
@endsection
