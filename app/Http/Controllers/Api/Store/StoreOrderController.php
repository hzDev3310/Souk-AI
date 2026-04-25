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

        // Append store_id to each item for easier filtering on frontend
        $orders->getCollection()->transform(function ($order) use ($store) {
            if ($order->items) {
                $order->items->each(function ($item) use ($store) {
                    $item->store_id = $store->id;
                });
            }
            return $order;
        });

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
            })->with('product.albums');
        }, 'client']);

        // Append store_id to each item for easier filtering on frontend
        if ($order->items) {
            $order->items->each(function ($item) use ($store) {
                $item->store_id = $store->id;
            });
        }

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

    /**
     * Update status of an individual order item (store-specific)
     * Also handles automatic order status logic
     */
    public function updateItemStatus(Request $request, Order $order, $itemId)
    {
        $store = $request->user()->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'No store associated with this account'
            ], 404);
        }

        // Validate the status
        $validated = $request->validate([
            'status' => 'required|string|in:en_cours,confirme,annule'
        ]);

        // Find the item and verify it belongs to this store
        $item = $order->items()
            ->whereHas('product', function ($query) use ($store) {
                $query->where('store_id', $store->id);
            })
            ->findOrFail($itemId);

        // Update item status
        $item->update(['status' => $validated['status']]);

        // Automatic Order Status Logic:
        // Get all items in the order across all stores
        $allItems = $order->items()->get();
        $allItemsCount = $allItems->count();
        $cancelledItemsCount = $allItems->where('status', 'annule')->count();
        $confirmedItemsCount = $allItems->where('status', 'confirme')->count();

        // If all items are cancelled, cancel the order
        if ($cancelledItemsCount === $allItemsCount) {
            $order->update(['status' => 'annule']);
        }
        // If at least one item is confirmed (even if others are cancelled), confirm the order
        elseif ($confirmedItemsCount > 0 &&  $confirmedItemsCount + $cancelledItemsCount == $allItemsCount) {
            $order->update(['status' => 'confirme']);
        }
        // Otherwise, keep it as pending/en_cours
        else {
            $order->update(['status' => 'en_cours']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item status updated successfully',
            'item' => $item->fresh(),
            'order_status' => $order->fresh()->status,
            'order_status_label' => $this->getStatusLabel($order->fresh()->status)
        ]);
    }

    /**
     * Helper method to get human-readable status labels
     */
    private function getStatusLabel($status)
    {
        $labels = [
            'en_cours' => 'Pending',
            'confirme' => 'Confirmed',
            'annule' => 'Cancelled',
            'en_shipping' => 'In Shipping',
            'shipping_company' => 'At Shipping Company',
            'shipped' => 'Shipped'
        ];

        return $labels[$status] ?? $status;
    }
}
