<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Order;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $request->validate(['description' => 'required|string']);

        $customer = $request->user()->customer;

        if ($order->customer_id !== $customer->id) {
            return response()->json(['message' => 'Akses tidak diizinkan.'], 403);
        }

        $complaint = Complaint::create([
            'order_id'    => $order->id,
            'customer_id' => $customer->id,
            'description' => $request->description,
        ]);

        return response()->json($complaint, 201);
    }

    public function index(Request $request)
    {
        $customer = $request->user()->customer;
        return response()->json(
            Complaint::where('customer_id', $customer->id)->with('order.service')->latest()->get()
        );
    }
}
