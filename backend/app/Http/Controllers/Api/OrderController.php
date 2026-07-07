<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Technician;
use App\Models\Warranty;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'service_id'          => 'required|exists:services,id',
            'order_type'          => 'required|in:home_service,pickup_dropoff',
            'problem_description' => 'required|string',
            'address'             => 'required|string',
        ]);

        $customer = $request->user()->customer;

        $order = Order::create([
            'order_code'          => 'SG-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
            'customer_id'         => $customer->id,
            'service_id'          => $request->service_id,
            'order_type'          => $request->order_type,
            'problem_description' => $request->problem_description,
            'address'             => $request->address,
            'latitude'            => $customer->latitude,
            'longitude'           => $customer->longitude,
        ]);

        $nearest = $this->findNearestTechnicians($request->service_id, $customer->latitude, $customer->longitude);

        return response()->json([
            'order'               => $order->load('service'),
            'nearest_technicians' => $nearest,
        ], 201);
    }

    public function customerIndex(Request $request)
    {
        $query = $request->user()->customer->orders()->with(['service', 'technician.user', 'rating']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function technicianIndex(Request $request)
    {
        $technician = $request->user()->technician;

        if ($request->scope === 'available') {
            $orders = Order::where('status', 'menunggu_teknisi')
                ->with(['service', 'customer.user'])
                ->latest()
                ->get();

            return response()->json($orders);
        }

        $query = Order::where('technician_id', $technician->id)->with(['service', 'customer.user', 'rating']);

        return response()->json($query->latest()->paginate(10));
    }

    public function show(Request $request, Order $order)
    {
        $this->authorizeAccess($request, $order);

        return response()->json($order->load(['service', 'customer.user', 'technician.user', 'details.sparepart', 'warranty', 'rating']));
    }

    public function accept(Request $request, Order $order)
    {
        if ($order->status !== 'menunggu_teknisi') {
            return response()->json(['message' => 'Order tidak dapat diterima.'], 422);
        }

        $technician = $request->user()->technician;

        $order->update([
            'technician_id' => $technician->id,
            'status'        => 'diterima',
        ]);

        return response()->json($order->load(['service', 'customer.user']));
    }

    public function submitDiagnosis(Request $request, Order $order)
    {
        if ($order->status !== 'pengecekan') {
            return response()->json(['message' => 'Status order harus pengecekan.'], 422);
        }

        $request->validate([
            'diagnosis_note' => 'required|string',
            'labor_cost'     => 'required|integer|min:0',
            'spareparts'     => 'nullable|array',
            'spareparts.*.sparepart_id' => 'required|exists:spareparts,id',
            'spareparts.*.qty'          => 'required|integer|min:1',
        ]);

        // Remove old details
        $order->details()->delete();

        $partsTotal = 0;
        foreach (($request->spareparts ?? []) as $item) {
            $sparepart = \App\Models\Sparepart::findOrFail($item['sparepart_id']);
            $subtotal = $sparepart->price * $item['qty'];
            $partsTotal += $subtotal;

            OrderDetail::create([
                'order_id'    => $order->id,
                'sparepart_id'=> $sparepart->id,
                'qty'         => $item['qty'],
                'price'       => $sparepart->price,
                'subtotal'    => $subtotal,
            ]);
        }

        $estimated = $request->labor_cost + $partsTotal;

        $order->update([
            'diagnosis_note' => $request->diagnosis_note,
            'labor_cost'     => $request->labor_cost,
            'estimated_cost' => $estimated,
            'status'         => 'menunggu_persetujuan',
        ]);

        return response()->json($order->load(['details.sparepart']));
    }

    public function approve(Request $request, Order $order)
    {
        if ($order->status !== 'menunggu_persetujuan') {
            return response()->json(['message' => 'Order tidak dalam status menunggu persetujuan.'], 422);
        }

        if ($order->customer_id !== $request->user()->customer->id) {
            return response()->json(['message' => 'Akses tidak diizinkan.'], 403);
        }

        $order->update([
            'is_approved_by_customer' => true,
            'approved_at'             => now(),
            'status'                  => 'perbaikan',
            'payment_status'          => 'dana_ditahan',
        ]);

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $technician = $request->user()->technician;

        if ($order->technician_id !== $technician->id) {
            return response()->json(['message' => 'Akses tidak diizinkan.'], 403);
        }

        $request->validate(['status' => 'required|in:pengecekan,selesai']);
        $newStatus = $request->status;

        $transitions = [
            'diterima'  => 'pengecekan',
            'perbaikan' => 'selesai',
        ];

        if (!isset($transitions[$order->status]) || $transitions[$order->status] !== $newStatus) {
            return response()->json(['message' => 'Transisi status tidak valid.'], 422);
        }

        $update = ['status' => $newStatus];

        if ($newStatus === 'selesai') {
            $update['completed_at']    = now();
            $update['final_cost']      = $order->estimated_cost;
            $update['payment_status']  = 'dana_diteruskan';

            $order->update($update);

            // Auto-create 30-day warranty
            Warranty::create([
                'order_id'  => $order->id,
                'start_date'=> now()->toDateString(),
                'end_date'  => now()->addDays(30)->toDateString(),
            ]);

            // Update technician stats
            $technician->increment('total_jobs');

            return response()->json($order->load('warranty'));
        }

        $order->update($update);

        return response()->json($order);
    }

    public function findNearestTechnicians(int $serviceId, float $lat, float $lng): array
    {
        return Technician::where('status', 'online')
            ->where('is_verified', true)
            ->with('user')
            ->get()
            ->map(function ($tech) use ($lat, $lng) {
                $tech->distance = $tech->distanceTo($lat, $lng);
                return $tech;
            })
            ->sortBy('distance')
            ->take(3)
            ->values()
            ->toArray();
    }

    private function authorizeAccess(Request $request, Order $order): void
    {
        $user = $request->user();

        if ($user->role === 'customer' && $order->customer_id !== $user->customer->id) {
            abort(403);
        }

        if ($user->role === 'technician' && $order->technician_id !== $user->technician->id) {
            abort(403);
        }
    }
}
