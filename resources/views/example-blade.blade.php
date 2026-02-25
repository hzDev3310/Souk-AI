<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blade Example - EcoMarket</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>

<body class="bg-soft-white dark:bg-dark-premium text-gray-900 dark:text-gray-100 antialiased">
    <div class="min-h-screen flex items-center justify-center p-6">
        <div
            class="glass p-12 rounded-[2.5rem] max-w-2xl w-full text-center shadow-2xl border-2 border-white/50 dark:border-white/10">
            <div class="w-20 h-20 bg-emerald-deep/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-emerald-deep" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 class="text-4xl font-bold mb-4">Laravel <span class="text-emerald-deep">Blade</span> Page</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                This page is rendered directly by the server using Laravel's Blade templating engine.
                It's fast, SEO-friendly, and perfect for static or lightly interactive content.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="{{ url('/') }}"
                    class="bg-emerald-deep text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-fresh transition-all">
                    Back Home
                </a>
                <a href="{{ url('/example-react') }}"
                    class="bg-blue-ai/10 text-blue-ai px-8 py-3 rounded-2xl font-bold hover:bg-blue-ai/20 transition-all border border-blue-ai/10">
                    Switch to React example
                </a>
            </div>
        </div>
    </div>
</body>

</html>