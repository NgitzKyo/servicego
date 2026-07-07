<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class TechnicianController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json($request->user()->load('technician'));
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'specialization' => 'nullable|string',
            'bio'            => 'nullable|string',
        ]);

        $technician = $request->user()->technician;
        $technician->update($request->only('specialization', 'bio'));

        return response()->json(['technician' => $technician]);
    }

    public function toggleStatus(Request $request)
    {
        $request->validate(['status' => 'required|in:online,offline']);

        $technician = $request->user()->technician;
        $technician->update(['status' => $request->status]);

        return response()->json(['technician' => $technician]);
    }

    public function dashboard(Request $request)
    {
        $technician = $request->user()->technician;
        $orders = Order::where('technician_id', $technician->id);

        return response()->json([
            'pendapatan'   => (clone $orders)->where('status', 'selesai')->sum('final_cost'),
            'order_selesai'=> (clone $orders)->where('status', 'selesai')->count(),
            'order_aktif'  => (clone $orders)->whereNotIn('status', ['selesai', 'dibatalkan'])->count(),
            'rating_avg'   => $technician->rating_avg,
        ]);
    }
}
