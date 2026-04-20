<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class StoreOrderController extends Controller
{
    /**
     * Get all orders containing products from the authenticated store
     */
    public function index(Request $request)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        // Get orders that have items from this store
        $orders = Order::whereHas('items', function ($query) use ($store) {
            $query->whereHas('product', function ($q) use ($store) {
                $q->where('store_id', $store->id);
            });
        })
        ->with(['items' => function ($query) use ($store) {
            $query->whereHas('product', function ($q) use ($store) {
                $q->where('store_id', $store->id);
            })->with('product');
        }, 'client'])
        ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Get a specific order with store's products
     */
    public function show(Request $request, Order $order)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        // Check if order contains products from this store
        $hasStoreProducts = OrderItem::where('order_id', $order->id)
            ->whereHas('product', function ($query) use ($store) {
                $query->where('store_id', $store->id);
            })
            ->exists();

        if (!$hasStoreProducts) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get only items from this store
        $order->load(['items' => function ($query) use ($store) {
            $query->whereHas('product', function ($q) use ($store) {
                $q->where('store_id', $store->id);
            })->with('product');
        }, 'client']);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Update order status for store's products
     */
    public function updateStatus(Request $request, Order $order)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'status' => 'required|in:en_cours,confirme,annule'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if order contains products from this store
        $hasStoreProducts = OrderItem::where('order_id', $order->id)
            ->whereHas('product', function ($query) use ($store) {
                $query->where('store_id', $store->id);
            })
            ->exists();

        if (!$hasStoreProducts) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Update only items from this store
        OrderItem::where('order_id', $order->id)
            ->whereHas('product', function ($query) use ($store) {
                $query->where('store_id', $store->id);
            })
            ->update(['status' => $request->status]);

        // Check if all items in the order are now confirmed (across all stores)
        // This could be useful to notify admin automatically, though requirement 2 says admin checks.
        
        return response()->json([
            'success' => true,
            'message' => 'Order item status updated successfully',
            'data' => $order->fresh()->load(['items' => function($q) use ($store) {
                 $q->whereHas('product', function($sq) use ($store) {
                     $sq->where('store_id', $store->id);
                 });
            }])
        ]);
    }
}
