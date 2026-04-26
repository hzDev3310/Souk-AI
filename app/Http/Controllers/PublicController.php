<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Client;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Store;
use App\Services\ProductSemanticSearchService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PublicController extends Controller
{
    private function applyPublicStoreVisibility($query): void
    {
        $query->where('isActive', true)
            ->whereHas('user', function ($userQuery) {
                $userQuery->where('isBlocked', false);
            });
    }

    public function index()
    {
        // Section 1: Top 8 products by orders
        $topProducts = Product::with(['store', 'albums'])
            ->whereHas('store', function($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->leftJoinSub(
                OrderItem::select('product_id', DB::raw('COUNT(*) as order_count'))
                    ->groupBy('product_id'),
                'order_items',
                'products.id',
                '=',
                'order_items.product_id'
            )
            ->orderByDesc(DB::raw('COALESCE(order_items.order_count, 0)'))
            ->limit(8)
            ->get();

        // Section 2: Top 8 categories by orders
        $topCategories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->leftJoinSub(
                DB::table('category_product')
                    ->select('category_id', DB::raw('COUNT(DISTINCT category_product.product_id) as order_count'))
                    ->leftJoin('products', 'category_product.product_id', '=', 'products.id')
                    ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
                    ->groupBy('category_id'),
                'category_orders',
                'categories.id',
                '=',
                'category_orders.category_id'
            )
            ->orderByDesc(DB::raw('COALESCE(category_orders.order_count, 0)'))
            ->limit(8)
            ->get(['categories.*']);

        // Section 3: Top 8 stores by orders
        $topStores = Store::where(function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->with('products')
            ->leftJoinSub(
                OrderItem::select('order_items.id')
                    ->join('products', 'order_items.product_id', '=', 'products.id')
                    ->select('products.store_id', DB::raw('COUNT(order_items.id) as order_count'))
                    ->groupBy('products.store_id'),
                'store_orders',
                'stores.id',
                '=',
                'store_orders.store_id'
            )
            ->orderByDesc(DB::raw('COALESCE(store_orders.order_count, 0)'))
            ->limit(8)
            ->get(['stores.*']);

        // Section 4: Latest 8 products (recent additions)
        $recentProducts = Product::with(['store', 'albums'])
            ->whereHas('store', function($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->latest()
            ->limit(8)
            ->get();

        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return view('public.home', compact('topProducts', 'topCategories', 'topStores', 'recentProducts', 'categories'));
    }

    public function product($slug)
    {
        $product = Product::with(['store', 'albums', 'variants'])
            ->whereHas('store', function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedProducts = Product::with(['store', 'albums'])
            ->whereHas('store', function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->where('store_id', $product->store_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return view('public.product', compact('product', 'relatedProducts'));
    }

    public function store($slug)
    {
        $store = Store::with(['products.albums'])
            ->where('slug', $slug)
            ->where(function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->firstOrFail();

        $products = $store->products()
            ->whereHas('store', function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->with('albums')
            ->paginate(12);

        return view('public.store', compact('store', 'products'));
    }

    public function category($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        
        $products = Product::whereJsonContains('categories', $category->id)
            ->whereHas('store', function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->with(['store', 'albums'])
            ->paginate(12);

        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return view('public.category', compact('category', 'products', 'categories'));
    }

    
    public function search(Request $request)
    {
        $query = $request->input('q');
        $minPrice = $request->input('min_price', 0);
        $maxPrice = $request->input('max_price', 999999);
        $categoryId = $request->input('category_id');
        $searchMode = $request->input('search_mode', 'keyword');
        $perPage = 12;

        $baseQuery = Product::whereHas('store', function($q) {
                $this->applyPublicStoreVisibility($q);
            })
            ->whereBetween('price', [$minPrice, $maxPrice]);

        if ($categoryId) {
            $baseQuery->whereJsonContains('categories', $categoryId);
        }

        $products = null;

        if (filled($query) && $searchMode === 'semantic') {
            $semanticResults = app(ProductSemanticSearchService::class)->search($query, clone $baseQuery);

            if ($semanticResults->isNotEmpty()) {
                $page = LengthAwarePaginator::resolveCurrentPage();
                $items = $semanticResults->slice(($page - 1) * $perPage, $perPage)->values();

                $products = new LengthAwarePaginator(
                    $items,
                    $semanticResults->count(),
                    $perPage,
                    $page,
                    [
                        'path' => $request->url(),
                        'query' => $request->query(),
                    ]
                );
            }
        }

        if (!$products) {
            $products = (clone $baseQuery)
                ->where(function($q) use ($query) {
                    $q->where('name_en', 'like', "%{$query}%")
                      ->orWhere('name_fr', 'like', "%{$query}%")
                      ->orWhere('name_ar', 'like', "%{$query}%")
                      ->orWhere('description_en', 'like', "%{$query}%")
                      ->orWhere('description_fr', 'like', "%{$query}%")
                      ->orWhere('description_ar', 'like', "%{$query}%");
                })
                ->with(['store', 'albums'])
                ->paginate($perPage);
        }

        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return view('public.search', compact('products', 'query', 'categories', 'minPrice', 'maxPrice', 'categoryId'));
    }

    public function cart()
    {
        $cart = session()->get('cart', []);
        $productIds = array_keys($cart);
        $products = Product::whereIn('id', $productIds)
            ->whereHas('store', function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->with(['store', 'albums'])
            ->get();
        
        $categories = Category::where('isActive', true)->whereNull('parent_id')->get();
        
        return view('public.cart', compact('products', 'cart', 'categories'));
    }

    public function addToCart(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);
        
        $cart = session()->get('cart', []);
        
        if(isset($cart[$productId])) {
            $cart[$productId] += $quantity;
        } else {
            $cart[$productId] = $quantity;
        }
        
        session()->put('cart', $cart);
        
        return response()->json(['success' => true, 'count' => count($cart)]);
    }

    public function removeFromCart(Request $request)
    {
        $productId = $request->input('product_id');
        $cart = session()->get('cart', []);
        
        if(isset($cart[$productId])) {
            unset($cart[$productId]);
            session()->put('cart', $cart);
        }
        
        return redirect()->back()->with('success', 'Product removed from cart');
    }

    public function updateCart(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');
        
        $cart = session()->get('cart', []);
        
        if(isset($cart[$productId])) {
            $cart[$productId] = max(1, $quantity);
            session()->put('cart', $cart);
        }
        
        return redirect()->back();
    }

    public function favorites()
    {
        $favorites = session()->get('favorites', []);
        $products = Product::whereIn('id', $favorites)
            ->whereHas('store', function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->with(['store', 'albums'])
            ->get();
        
        $categories = Category::where('isActive', true)->whereNull('parent_id')->get();
        
        return view('public.favorites', compact('products', 'categories'));
    }

    public function toggleFavorite(Request $request)
    {
        $productId = $request->input('product_id');
        $favorites = session()->get('favorites', []);
        
        if (($key = array_search($productId, $favorites)) !== false) {
            unset($favorites[$key]);
            $status = 'removed';
        } else {
            $favorites[] = $productId;
            $status = 'added';
        }
        
        session()->put('favorites', array_values($favorites));
        
        return response()->json(['success' => true, 'status' => $status, 'count' => count($favorites)]);
    }

    public function checkout()
    {
        $cart = session()->get('cart', []);
        if(empty($cart)) return redirect()->route('public.cart');

        $productIds = array_keys($cart);
        $products = Product::whereIn('id', $productIds)
            ->whereHas('store', function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->with(['store'])
            ->get();
        
        $total = 0;
        foreach($products as $product) {
            $price = $product->promo > 0 ? $product->price * (1 - $product->promo/100) : $product->price;
            $total += $price * $cart[$product->id];
        }

        $categories = Category::where('isActive', true)->whereNull('parent_id')->get();
        
        return view('public.checkout', compact('products', 'cart', 'total', 'categories'));
    }

    public function processCheckout(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email'.(Auth::check() ? '' : '|unique:users,email'),
            'address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'lat' => 'required',
            'lon' => 'required',
        ]);

        $cart = session()->get('cart', []);
        if(empty($cart)) return redirect()->route('public.home');

        return DB::transaction(function() use ($request, $cart) {
            if(Auth::check()) {
                $user = Auth::user();
            } else {
                $password = strval(random_int(1, 99999999));
                $user = User::create([
                    'name' => $request->first_name,
                    'family_name' => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($password),
                    'role' => 'client'
                ]);
                
                Auth::login($user, true);
                
                session()->put('guest_temp_password', $password);
            }

            $client = Client::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'address' => $request->address,
                    'city' => $request->city,
                    'codePostal' => $request->postal_code,
                    'lat' => $request->lat,
                    'lon' => $request->lon,
                ]
            );

            $productIds = array_keys($cart);
            $products = Product::whereIn('id', $productIds)
                ->whereHas('store', function ($query) {
                    $this->applyPublicStoreVisibility($query);
                })
                ->get();
            $totalAmount = 0;
            
            foreach($products as $product) {
                $price = $product->promo > 0 ? $product->price * (1 - $product->promo/100) : $product->price;
                $totalAmount += $price * $cart[$product->id];
            }

            $order = Order::create([
                'client_id' => $client->id,
                'status' => 'PENDING',
                'totalAmount' => $totalAmount,
            ]);

            foreach($products as $product) {
                $price = $product->promo > 0 ? $product->price * (1 - $product->promo/100) : $product->price;
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cart[$product->id],
                    'price' => $price,
                    'status' => 'PENDING',
                ]);
            }

            session()->forget('cart');

            return view('public.success', [
                'order' => $order,
                'categories' => Category::where('isActive', true)->whereNull('parent_id')->get()
            ]);
        });
    }

    // New sections for navigation pages
    public function allProducts(Request $request)
    {
        $sort = $request->input('sort', 'orders'); // orders, alphabetic, latest, price_asc, price_desc
        $minPrice = $request->input('min_price', 0);
        $maxPrice = $request->input('max_price', 999999);
        $categoryId = $request->input('category_id');
        $storeId = $request->input('store_id');

        $products = Product::with(['store', 'albums'])
            ->whereHas('store', function($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->whereBetween('price', [$minPrice, $maxPrice]);

        if ($storeId) {
            $products = $products->where('store_id', $storeId);
        }

        if ($categoryId) {
            $products = $products->whereJsonContains('categories', $categoryId);
        }

        // Apply sorting
        if ($sort === 'orders') {
            $products = $products->leftJoinSub(
                OrderItem::select('product_id', DB::raw('COUNT(*) as order_count'))
                    ->groupBy('product_id'),
                'order_items',
                'products.id',
                '=',
                'order_items.product_id'
            )->orderByDesc(DB::raw('COALESCE(order_items.order_count, 0)'));
        } elseif ($sort === 'alphabetic') {
            $products = $products->orderBy('name_en');
        } elseif ($sort === 'latest') {
            $products = $products->latest();
        } elseif ($sort === 'price_asc') {
            $products = $products->orderBy('price');
        } elseif ($sort === 'price_desc') {
            $products = $products->orderByDesc('price');
        }

        $products = $products->paginate(12);

        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return view('public.all-products', compact('products', 'categories', 'sort', 'minPrice', 'maxPrice', 'categoryId'));
    }

    public function allCategories()
    {
        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->leftJoinSub(
                DB::table('category_product')
                    ->select('category_id', DB::raw('COUNT(DISTINCT category_product.product_id) as order_count'))
                    ->leftJoin('products', 'category_product.product_id', '=', 'products.id')
                    ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
                    ->groupBy('category_id'),
                'category_orders',
                'categories.id',
                '=',
                'category_orders.category_id'
            )
            ->with('children')
            ->orderByDesc(DB::raw('COALESCE(category_orders.order_count, 0)'))
            ->paginate(12);

        return view('public.all-categories', compact('categories'));
    }

    public function allStores()
    {
        $stores = Store::where(function ($query) {
                $this->applyPublicStoreVisibility($query);
            })
            ->leftJoinSub(
                OrderItem::select('order_items.id')
                    ->join('products', 'order_items.product_id', '=', 'products.id')
                    ->select('products.store_id', DB::raw('COUNT(order_items.id) as order_count'))
                    ->groupBy('products.store_id'),
                'store_orders',
                'stores.id',
                '=',
                'store_orders.store_id'
            )
            ->with('products')
            ->orderByDesc(DB::raw('COALESCE(store_orders.order_count, 0)'))
            ->paginate(12);

        return view('public.all-stores', compact('stores'));
    }

    public function about()
    {
        return view('public.about');
    }

    public function terms()
    {
        return view('public.terms');
    }

    public function contact()
    {
        return view('public.contact');
    }

    public function showLogin()
    {
        return view('public.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            $request->session()->regenerate();
            return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegister()
    {
        return view('public.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'family_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'family_name' => $request->family_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
        ]);

        Client::create([
            'user_id' => $user->id,
        ]);

        Auth::login($user);

        return redirect()->route('home');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }

    public function profile()
    {
        $user = Auth::user();
        $client = $user->client;
        $categories = Category::where('isActive', true)->whereNull('parent_id')->get();
        return view('public.profile', compact('user', 'client', 'categories'));
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'family_name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'codePostal' => 'required|string',
        ]);

        $user = Auth::user();
        $user->update([
            'name' => $request->name,
            'family_name' => $request->family_name,
        ]);

        $user->client()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'address' => $request->address,
                'city' => $request->city,
                'codePostal' => $request->codePostal,
            ]
        );

        return back()->with('success', 'Profile updated successfully');
    }

    public function orders()
    {
        $user = Auth::user();
        $orders = Order::where('client_id', $user->client->id)->with('items.product')->latest()->get();
        $categories = Category::where('isActive', true)->whereNull('parent_id')->get();
        return view('public.orders', compact('orders', 'categories'));
    }
}
