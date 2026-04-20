<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(["client.user", "influencer.user"])
            ->withCount('items')
            ->withCount(['items as confirmed_items_count' => function ($query) {
                $query->where('status', 'confirme');
            }])
            ->orderBy("created_at", "desc")
            ->paginate(15);
            
        return response()->json($orders);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with(["client.user", "influencer.user", "items.product.store", "items.variant", "factures", "driver.user"])
            ->findOrFail($id);
            
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            "status" => "required|string|in:en_cours,confirme,annule,en_shipping,shipping_company,shipped",
            "driver_id" => "nullable|exists:shipping_emps,id"
        ]);
        
        // Logistics check: Restricted to Admin and Shipping Company
        $user = $request->user();
        if (!in_array($user->role, ['ADMIN', 'SHIPPING_COMPANY'])) {
            if (in_array($validated['status'], ['en_shipping', 'shipping_company', 'shipped'])) {
                return response()->json(["message" => "Only Admin or Shipping Company can set logistics statuses"], 403);
            }
        }

        $order->update($validated);
        
        return response()->json([
            "message" => "Order updated successfully",
            "order" => $order->fresh(['client.user', 'driver.user', 'items.product'])
        ]);
    }

    /**
     * Update status of an individual order item
     */
    public function updateItemStatus(Request $request, $orderId, $itemId)
    {
        $order = Order::findOrFail($orderId);
        $item = $order->items()->findOrFail($itemId);
        
        $validated = $request->validate([
            "status" => "required|string|in:en_cours,confirme,annule"
        ]);

        $item->update(['status' => $validated['status']]);
        
        return response()->json([
            "message" => "Item status updated",
            "item" => $item,
            "order_status" => $order->fresh()->status
        ]);
    }

    /**
     * Admin can remove order item and confirm manually
     */
    public function removeItem(Request $request, $orderId, $itemId)
    {
        $order = Order::findOrFail($orderId);
        $item = $order->items()->findOrFail($itemId);
        
        $item->delete();
        
        return response()->json([
            "message" => "Item removed",
            "order_status" => $order->fresh()->status
        ]);
    }
    
    /**
     * Manually confirm the order (as per requirement 4: admin can confirm manually)
     */
    public function confirmManually($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'confirme']);
        
        return response()->json([
            "message" => "Order confirmed manually",
            "order" => $order->fresh(['items'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        
        return response()->json(["message" => "Order deleted successfully"]);
    }
}
