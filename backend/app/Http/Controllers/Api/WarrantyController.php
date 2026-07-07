<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Warranty;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WarrantyController extends Controller
{
    public function index(Request $request)
    {
        $customer = $request->user()->customer;
        $warranties = Warranty::whereHas('order', fn($q) => $q->where('customer_id', $customer->id))
            ->with(['order.service', 'order.technician.user'])
            ->latest()
            ->get();

        return response()->json($warranties);
    }

    public function claim(Request $request, Warranty $warranty)
    {
        if ($warranty->status !== 'aktif') {
            return response()->json(['message' => 'Garansi tidak aktif.'], 422);
        }

        if ($warranty->isExpired()) {
            $warranty->update(['status' => 'kadaluarsa']);
            return response()->json(['message' => 'Garansi sudah kadaluarsa.'], 422);
        }

        $original = $warranty->order;
        $customer = $request->user()->customer;

        if ($original->customer_id !== $customer->id) {
            return response()->json(['message' => 'Akses tidak diizinkan.'], 403);
        }

        $claimOrder = Order::create([
            'order_code'          => 'SG-CLM-' . strtoupper(Str::random(6)),
            'customer_id'         => $customer->id,
            'technician_id'       => $original->technician_id,
            'service_id'          => $original->service_id,
            'order_type'          => $original->order_type,
            'problem_description' => 'Klaim garansi dari order ' . $original->order_code,
            'address'             => $original->address,
            'latitude'            => $original->latitude,
            'longitude'           => $original->longitude,
            'status'              => 'diterima',
            'final_cost'          => 0,
            'estimated_cost'      => 0,
            'payment_status'      => 'dana_diteruskan',
        ]);

        $warranty->update(['status' => 'diklaim', 'claim_order_id' => $claimOrder->id]);

        return response()->json(['claim_order' => $claimOrder, 'warranty' => $warranty]);
    }
}
