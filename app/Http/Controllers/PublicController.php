<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Client;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PublicController extends Controller
{
    public function index()
    {
        $products = Product::with(['store', 'albums'])
            ->whereHas('store', function($query) {
                $query->where('isActive', true);
            })
            ->latest()
            ->paginate(12);

        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return view('public.home', compact('products', 'categories'));
    }

    public function product($slug)
    {
        $product = Product::with(['store', 'albums', 'variants'])
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedProducts = Product::with(['store', 'albums'])
            ->where('store_id', $product->store_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return view('public.product', compact('product', 'relatedProducts'));
    }

    public function category($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        
        $products = Product::whereJsonContains('categories', $category->id)
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
        
        $products = Product::whereHas('store', function($q) {
                $q->where('isActive', true);
            })
            ->where(function($q) use ($query) {
                $q->where('name_en', 'like', "%{$query}%")
                  ->orWhere('name_fr', 'like', "%{$query}%")
                  ->orWhere('name_ar', 'like', "%{$query}%")
                  ->orWhere('description_en', 'like', "%{$query}%");
            })
            ->with(['store', 'albums'])
            ->paginate(12);

        $categories = Category::where('isActive', true)
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return view('public.search', compact('products', 'query', 'categories'));
    }

    public function cart()
    {
        $cart = session()->get('cart', []);
        $productIds = array_keys($cart);
        $products = Product::whereIn('id', $productIds)->with(['store', 'albums'])->get();
        
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
        $products = Product::whereIn('id', $favorites)->with(['store', 'albums'])->get();
        
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
        $products = Product::whereIn('id', $productIds)->with(['store'])->get();
        
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
                $password = Str::random(10);
                $user = User::create([
                    'name' => $request->first_name,
                    'family_name' => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($password),
                    'role' => 'client'
                ]);
                
                Auth::login($user);
                
                // TODO: Send email with password
                // Mail::to($user->email)->send(new WelcomeClientMail($user, $password));
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
            $products = Product::whereIn('id', $productIds)->get();
            $totalAmount = 0;
            
            foreach($products as $product) {
                $price = $product->promo > 0 ? $product->price * (1 - $product->promo/100) : $product->price;
                $totalAmount += $price * $cart[$product->id];
            }

            $order = Order::create([
                'client_id' => $client->id,
                'status' => 'en_attente',
                'totalAmount' => $totalAmount,
            ]);

            foreach($products as $product) {
                $price = $product->promo > 0 ? $product->price * (1 - $product->promo/100) : $product->price;
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cart[$product->id],
                    'price' => $price,
                    'status' => 'en_attente',
                ]);
            }

            session()->forget('cart');

            return view('public.success', [
                'order' => $order,
                'categories' => Category::where('isActive', true)->whereNull('parent_id')->get()
            ]);
        });
    }
}
