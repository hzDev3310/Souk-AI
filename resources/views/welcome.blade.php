<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>EcoMarket | Souk.AI - Social Commerce for Circular Economy</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Styles / Scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <style>
        body {
            font-family: 'Outfit', sans-serif;
        }

        .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .glass {
            background: rgba(17, 24, 39, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>

<body
    class="bg-soft-white dark:bg-dark-premium text-gray-900 dark:text-gray-100 antialiased selection:bg-emerald-deep selection:text-white">

    <div class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <!-- Background Decorative Elements -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-deep/10 rounded-full blur-[120px]">
            </div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-ai/10 rounded-full blur-[120px]">
            </div>
        </div>

        <!-- Navbar -->
        <nav class="fixed top-0 w-full z-50 px-6 py-4">
            <div class="max-w-7xl mx-auto flex items-center justify-between glass py-3 px-6 rounded-2xl shadow-sm">
                <div class="flex items-center gap-2">
                    <div
                        class="w-10 h-10 bg-emerald-deep rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>
                    <span class="text-2xl font-bold tracking-tight text-emerald-deep dark:text-white">Souk<span
                            class="text-blue-ai">.AI</span></span>
                </div>

                <div class="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="#" class="hover:text-emerald-deep transition-colors">Marketplace</a>
                    <a href="#" class="hover:text-emerald-deep transition-colors">How it Works</a>
                    <a href="#" class="hover:text-emerald-deep transition-colors">Sustainability</a>
                    <a href="#" class="hover:text-emerald-deep transition-colors">Influencers</a>
                </div>

                <div class="flex items-center gap-4">
                    @if (Route::has('login'))
                    @auth
                    <a href="{{ url('/dashboard') }}" class="text-sm font-semibold hover:underline">Dashboard</a>
                    @else
                    <a href="{{ route('login') }}"
                        class="text-sm font-semibold hover:text-emerald-deep transition-colors">Log in</a>
                    @if (Route::has('register'))
                    <a href="{{ route('register') }}"
                        class="bg-emerald-deep text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-fresh transition-all shadow-lg shadow-emerald-deep/20">
                        Join Now
                    </a>
                    @endif
                    @endauth
                    @endif
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <main class="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row items-center gap-12">
            <div class="flex-1 text-center md:text-left">
                <div
                    class="inline-flex items-center gap-2 bg-emerald-deep/10 text-emerald-deep dark:bg-emerald-deep/20 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-emerald-deep/10">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Tounes El Khadhra - Circular Economy
                </div>

                <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                    The Future of <br />
                    <span class="text-emerald-deep underline decoration-blue-ai/30">Social Commerce</span>
                </h1>

                <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl">
                    Bridge traditional retail with modern influencer marketing.
                    A sustainable marketplace focused on "State of Wear" tracking and smart AI insights for the circular
                    economy.
                </p>

                <div class="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        class="w-full sm:w-auto bg-emerald-deep text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-fresh transition-all shadow-xl shadow-emerald-deep/20 flex items-center justify-center gap-2 group">
                        Explore Products
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    <button
                        class="w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        How it Works
                    </button>
                </div>

                <!-- Trust Stats -->
                <div
                    class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center gap-8 justify-center md:justify-start">
                    <div>
                        <div class="text-2xl font-bold text-emerald-deep uppercase">10k+</div>
                        <div class="text-sm text-gray-500">Products</div>
                    </div>
                    <div class="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                    <div>
                        <div class="text-2xl font-bold text-blue-ai uppercase">500+</div>
                        <div class="text-sm text-gray-500">Influencers</div>
                    </div>
                    <div class="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                    <div>
                        <div class="text-2xl font-bold text-emerald-500 uppercase">100%</div>
                        <div class="text-sm text-gray-500">Sustainabilty</div>
                    </div>
                </div>
            </div>

            <!-- Hero Image Placeholder / Graphic -->
            <div class="flex-1 w-full max-w-2xl">
                <div class="relative aspect-square">
                    <div
                        class="absolute inset-0 bg-gradient-to-tr from-emerald-deep to-blue-ai rounded-[3rem] rotate-3 opacity-20 animate-pulse">
                    </div>
                    <div
                        class="absolute inset-4 glass rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-2xl">
                        <div class="p-8 text-center">
                            <div
                                class="w-20 h-20 bg-emerald-deep/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-emerald-deep" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold mb-2">Powered by AI</h3>
                            <p class="text-gray-500 dark:text-gray-400">Semantic search & state of wear analysis for
                                every product.</p>
                        </div>

                        <!-- Mock Product Card -->
                        <div class="mt-4 w-full px-8">
                            <div
                                class="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-800">
                                <div class="flex items-center gap-4">
                                    <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
                                    <div class="flex-1">
                                        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="text-xs bg-emerald-deep/10 text-emerald-deep px-2 py-0.5 rounded">New
                                                Condition</span>
                                            <span class="text-xs font-bold">45.00 TND</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- AI Feature Highlight -->
    <section class="w-full bg-dark-premium py-20 px-6">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div class="flex-1">
                <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">The <span
                        class="text-blue-ai">Intelligent</span> Marketplace</h2>
                <p class="text-gray-400 mb-8 text-lg">
                    Souk.AI utilizes advanced computer vision to analyze product images and automatically determine the
                    "State of Wear", ensuring transparency and trust in the circular economy.
                </p>
                <ul class="space-y-4">
                    <li class="flex items-center gap-3 text-white font-medium">
                        <div class="w-6 h-6 bg-blue-ai rounded-full flex items-center justify-center text-[10px]">✓
                        </div>
                        Automated Damage Detection
                    </li>
                    <li class="flex items-center gap-3 text-white font-medium">
                        <div class="w-6 h-6 bg-blue-ai rounded-full flex items-center justify-center text-[10px]">✓
                        </div>
                        Derja-to-English Translation
                    </li>
                    <li class="flex items-center gap-3 text-white font-medium">
                        <div class="w-6 h-6 bg-blue-ai rounded-full flex items-center justify-center text-[10px]">✓
                        </div>
                        Semantic Product Matching
                    </li>
                </ul>
            </div>
            <div class="flex-1 grid grid-cols-2 gap-4">
                <div class="h-40 bg-emerald-deep/20 rounded-3xl border border-emerald-deep/30"></div>
                <div class="h-40 bg-blue-ai/20 rounded-3xl border border-blue-ai/30 mt-8"></div>
            </div>
        </div>
    </section>

    <footer class="bg-soft-white dark:bg-gray-950 py-12 px-6 border-t border-gray-200 dark:border-gray-900">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="flex items-center gap-2 text-2xl font-bold tracking-tight text-emerald-deep dark:text-white">
                Souk<span class="text-blue-ai">.AI</span>
            </div>
            <p class="text-sm text-gray-500">© 2026 EcoMarket Connect. Built for Tunisia's Green Future.</p>
            <div class="flex gap-6">
                <a href="#" class="text-gray-400 hover:text-emerald-deep transition-colors">Twitter</a>
                <a href="#" class="text-gray-400 hover:text-emerald-deep transition-colors">Instagram</a>
                <a href="#" class="text-gray-400 hover:text-emerald-deep transition-colors">Github</a>
            </div>
        </div>
    </footer>

</body>

</html>