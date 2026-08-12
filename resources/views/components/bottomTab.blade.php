<div class="lg:hidden fixed bottom-4 left-4 right-4 z-50">
    <div
        class="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-2 flex items-center justify-around shadow-2xl shadow-gray-200/30 dark:shadow-gray-950/50">

        <!-- Home -->
        <a href="/"
            class="group flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 relative {{ request()->is('/') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
           
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="{{ request()->is('/') ? 'currentColor' : 'none' }}" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"
                class="transition-transform duration-300 group-hover:scale-110">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span class="text-[10px] font-medium tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">{{ __('website.nav.home') }}</span>
         @if(request()->is('/'))
                <span class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></span>
            @endif
        </a>

        <!-- Cart -->
        <a href="/cart"
            class="group flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 relative {{ request()->is('cart*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
          
            <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                    class="transition-transform duration-300 group-hover:scale-110">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span id="cart-count-mobile"
                    class="absolute -top-1.5 -right-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg shadow-red-500/30 {{ count(session()->get('cart', [])) > 0 ? '' : 'hidden' }} animate-pulse">
                    {{ count(session()->get('cart', [])) }}
                </span>
            </div>
            <span class="text-[10px] font-medium tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">Cart</span>
          @if(request()->is('cart*'))
                <span class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></span>
            @endif
        </a>

        <!-- Search (FAB - Middle) -->
        <div class="relative -mt-16">
            <button id="open-mobile-search"
                class="relative w-16 h-16 m-2 border-4 border-slate-800 !rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/40 dark:shadow-primary/20 hover:shadow-xl hover:shadow-primary/50 dark:hover:shadow-primary/30 active:scale-90 transition-all duration-300 group flex items-center justify-center">
                <div class="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                    class="relative z-10 text-white drop-shadow-sm">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m16 16 3 3" />
                </svg>
            </button>
        </div>

        <!-- Orders -->
        <a href="{{ route('public.orders') }}"
            class="group flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 relative {{ request()->is('orders*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
           
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                class="transition-transform duration-300 group-hover:scale-110">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
            </svg>
            <span class="text-[10px] font-medium tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">Orders</span>
             @if(request()->is('orders*'))
                <span class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></span>
            @endif
        </a>

        <!-- Profile / Login -->
        @auth
            <a href="{{ route('public.profile') }}"
                class="group flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 relative {{ request()->is('profile*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
               
                <div
                    class="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-bold text-xs shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
                    {{ substr(Auth::user()->name, 0, 1) }}
                </div>
                <span class="text-[10px] font-medium tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">Profile</span>
                 @if(request()->is('profile*'))
                    <span class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></span>
                @endif
            </a>
        @else
            <a href="/login"
                class="group flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 relative {{ request()->is('login*') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' }}">
             
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                    class="transition-transform duration-300 group-hover:scale-110">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <span class="text-[10px] font-medium tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">Login</span>
                   @if(request()->is('login*'))
                    <span class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></span>
                @endif
            </a>
        @endauth
    </div>
</div>