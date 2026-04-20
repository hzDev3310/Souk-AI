@extends('layouts.public')

@section('seo')
    <title>Checkout - Souk AI</title>
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <style>
        #map { height: 400px; border-radius: 24px; }
        .glass { backdrop-filter: blur(16px); }
    </style>
@endsection

@section('content')
    <div class="mb-12">
        <h1 class="text-5xl font-black text-foreground tracking-tight mb-4">Complete Your Order</h1>
        <p class="text-muted-foreground font-medium">Please provide your details and shipping location.</p>
    </div>

    <form action="{{ route('public.checkout.process') }}" method="POST" id="checkout-form">
        @csrf
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Details Form -->
            <div class="lg:col-span-2 space-y-8">
                <div class="glass border border-border/40 rounded-[40px] p-8 premium-shadow space-y-8">
                    <h3 class="text-xs font-black uppercase tracking-[0.2em] text-foreground border-l-4 border-primary pl-4">Personal Information</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase text-muted-foreground ml-4">First Name</label>
                            <input type="text" name="first_name" required value="{{ Auth::user()->name ?? old('first_name') }}" class="w-full bg-muted/20 border border-border/40 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-colors">
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase text-muted-foreground ml-4">Last Name</label>
                            <input type="text" name="last_name" required value="{{ Auth::user()->family_name ?? old('last_name') }}" class="w-full bg-muted/20 border border-border/40 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-colors">
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase text-muted-foreground ml-4">Email Address</label>
                        <input type="email" name="email" required value="{{ Auth::user()->email ?? old('email') }}" class="w-full bg-muted/20 border border-border/40 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-colors">
                        @if(!Auth::check())
                            <p class="text-[10px] text-muted-foreground mt-2 ml-4">We'll create an account for you and send your password via email.</p>
                        @endif
                    </div>
                </div>

                <div class="glass border border-border/40 rounded-[40px] p-8 premium-shadow space-y-8">
                    <h3 class="text-xs font-black uppercase tracking-[0.2em] text-foreground border-l-4 border-primary pl-4">Shipping Location</h3>
                    
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="md:col-span-2 space-y-2">
                                <label class="text-xs font-black uppercase text-muted-foreground ml-4">Street Address</label>
                                <input type="text" name="address" id="address-input" required class="w-full bg-muted/20 border border-border/40 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-colors">
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-black uppercase text-muted-foreground ml-4">City</label>
                                <input type="text" name="city" id="city-input" required class="w-full bg-muted/20 border border-border/40 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-colors">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="space-y-2">
                                <label class="text-xs font-black uppercase text-muted-foreground ml-4">Postal Code</label>
                                <input type="text" name="postal_code" id="postcode-input" required class="w-full bg-muted/20 border border-border/40 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-colors">
                            </div>
                            <!-- Hidden inputs for Lat/Lon -->
                            <input type="hidden" name="lat" id="lat-input" value="36.8065">
                            <input type="hidden" name="lon" id="lon-input" value="10.1815">
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between text-xs font-black uppercase text-muted-foreground ml-4">
                                <span>Select Location on Map</span>
                                <button type="button" id="use-current-location" class="text-primary hover:underline transition-all">Use Current Position</button>
                            </div>
                            
                            <div class="relative">
                                <!-- Place Search -->
                                <div class="absolute top-4 left-4 z-[1000] right-4 md:right-auto md:w-80">
                                    <div class="flex gap-2">
                                        <input type="text" id="map-search" placeholder="Search for a place..." class="flex-1 bg-white dark:bg-black/80 border border-border/40 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-primary/50 text-sm shadow-xl backdrop-blur-md">
                                        <button type="button" id="search-btn" class="bg-primary text-white p-2 rounded-xl shadow-xl hover:scale-105 transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                        </button>
                                    </div>
                                    <div id="search-results" class="hidden mt-2 bg-white dark:bg-black/90 border border-border/40 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md max-h-48 overflow-y-auto">
                                        <!-- Dynamic search results -->
                                    </div>
                                </div>
                                <div id="map"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="space-y-6">
                <div class="glass border border-border/40 rounded-[40px] p-8 premium-shadow sticky top-32 space-y-8">
                    <h3 class="text-xs font-black uppercase tracking-[0.2em] text-foreground">Order Summary</h3>
                    
                    <div class="space-y-4 max-h-60 overflow-y-auto">
                        @foreach($products as $product)
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl overflow-hidden bg-muted/10">
                                    @if($product->albums->first())
                                        <img src="/storage/{{ $product->albums->first()->file }}" alt="" class="w-full h-full object-cover">
                                    @endif
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-bold text-foreground truncate">{{ $product->name_en }}</p>
                                    <p class="text-[10px] text-muted-foreground">Qty: {{ $cart[$product->id] }}</p>
                                </div>
                                <p class="text-xs font-black text-foreground">
                                    @php $price = $product->promo > 0 ? $product->price * (1 - $product->promo/100) : $product->price; @endphp
                                    {{ number_format($price * $cart[$product->id], 2) }}
                                </p>
                            </div>
                        @endforeach
                    </div>

                    <div class="pt-8 border-t border-border/20 space-y-4">
                        <div class="flex justify-between items-end">
                            <span class="text-lg font-black text-foreground">Total</span>
                            <div class="text-right">
                                 <p class="text-2xl font-black text-primary">{{ number_format($total, 2) }}</p>
                                 <p class="text-[10px] font-black text-muted-foreground uppercase">TND</p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="w-full py-5 bg-primary text-white rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-primaryemphasis transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                        Place Order
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </form>
@endsection

@push('scripts')
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
        // Init map (centered on Tunis, restricted to Tunisia)
        const tunisiaBounds = L.latLngBounds([30.0, 7.0], [38.0, 12.0]);
        const map = L.map('map', {
            maxBounds: tunisiaBounds,
            maxBoundsViscosity: 1.0
        }).setView([36.8065, 10.1815], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        let marker = L.marker([36.8065, 10.1815], { draggable: true }).addTo(map);

        function updateInputs(lat, lon) {
            document.getElementById('lat-input').value = lat;
            document.getElementById('lon-input').value = lon;
            
            // Reverse Geocoding to fill address (restricted to Tunisia)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&countrycodes=tn`)
                .then(res => res.json())
                .then(data => {
                    if(data.address) {
                        if(data.address.road) document.getElementById('address-input').value = data.address.road;
                        if(data.address.city || data.address.town || data.address.village) {
                            document.getElementById('city-input').value = data.address.city || data.address.town || data.address.village;
                        }
                        if(data.address.postcode) document.getElementById('postcode-input').value = data.address.postcode;
                    }
                });
        }

        marker.on('dragend', function() {
            const pos = marker.getLatLng();
            updateInputs(pos.lat, pos.lng);
        });

        map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            updateInputs(e.latlng.lat, e.latlng.lng);
        });

        // Search Functionality
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('map-search');
        const resultsEl = document.getElementById('search-results');

        function performSearch() {
            const query = searchInput.value;
            if(query.length < 3) return;

            // Restricted to Tunisia via countrycodes=tn
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=tn`)
                .then(res => res.json())
                .then(data => {
                    resultsEl.innerHTML = '';
                    resultsEl.classList.remove('hidden');
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'px-4 py-2 hover:bg-muted/20 cursor-pointer text-xs transition-colors border-b border-border/20 last:border-0';
                        div.innerText = item.display_name;
                        div.onclick = () => {
                            const lat = parseFloat(item.lat);
                            const lon = parseFloat(item.lon);
                            map.setView([lat, lon], 16);
                            marker.setLatLng([lat, lon]);
                            updateInputs(lat, lon);
                            resultsEl.classList.add('hidden');
                            searchInput.value = item.display_name;
                        };
                        resultsEl.appendChild(div);
                    });
                });
        }

        searchBtn.onclick = performSearch;
        searchInput.onkeypress = (e) => { if(e.key === 'Enter') performSearch(); };

        // Use Current Location
        document.getElementById('use-current-location').onclick = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    map.setView([lat, lon], 16);
                    marker.setLatLng([lat, lon]);
                    updateInputs(lat, lon);
                });
            }
        };

        // Close search results on outside click
        document.addEventListener('click', (e) => {
            if(!resultsEl.contains(e.target) && e.target !== searchInput) {
                resultsEl.classList.add('hidden');
            }
        });
    </script>
@endpush
