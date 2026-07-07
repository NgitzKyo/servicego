<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Order;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_user'             => User::count(),
            'total_customer'         => User::where('role', 'customer')->count(),
            'total_technician'       => User::where('role', 'technician')->count(),
            'total_order'            => Order::count(),
            'order_selesai'          => Order::where('status', 'selesai')->count(),
            'revenue_simulasi'       => Order::where('status', 'selesai')->sum('final_cost'),
            'teknisi_belum_verifikasi'=> Technician::where('is_verified', false)->count(),
            'komplain_terbuka'       => Complaint::where('status', 'terbuka')->count(),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::with('technician')->where('role', '!=', 'admin');

        if ($request->role) {
            $query->where('role', $request->role);
        }

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function verifyTechnician(Technician $technician)
    {
        $technician->update(['is_verified' => true]);
        return response()->json(['message' => 'Teknisi berhasil diverifikasi.', 'technician' => $technician]);
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User berhasil dihapus.']);
    }

    public function orders(Request $request)
    {
        $query = Order::with(['service', 'customer.user', 'technician.user']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function complaints(Request $request)
    {
        $query = Complaint::with(['customer.user', 'order.service']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function resolveComplaint(Request $request, Complaint $complaint)
    {
        $request->validate([
            'status'         => 'required|in:diproses,selesai',
            'admin_response' => 'nullable|string',
        ]);

        $complaint->update($request->only('status', 'admin_response'));

        return response()->json($complaint);
    }
}
