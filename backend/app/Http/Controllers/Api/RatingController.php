<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $request->validate([
            'score'  => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);

        $customer = $request->user()->customer;

        if ($order->customer_id !== $customer->id || $order->status !== 'selesai') {
            return response()->json(['message' => 'Tidak dapat memberi rating.'], 422);
        }

        if ($order->rating) {
            return response()->json(['message' => 'Sudah memberi rating.'], 422);
        }

        $rating = Rating::create([
            'order_id'      => $order->id,
            'customer_id'   => $customer->id,
            'technician_id' => $order->technician_id,
            'score'         => $request->score,
            'review'        => $request->review,
        ]);

        // Recalculate technician rating_avg
        $technician = $order->technician;
        $avg = Rating::where('technician_id', $technician->id)->avg('score');
        $technician->update(['rating_avg' => round($avg, 2)]);

        return response()->json($rating);
    }
}
