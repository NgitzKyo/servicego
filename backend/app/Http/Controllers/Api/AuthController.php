<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Customer;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'phone'         => 'required|string|max:20',
            'password'      => 'required|string|min:6|confirmed',
            'role'          => 'required|in:customer,technician',
            'address'       => 'required_if:role,customer|nullable|string',
            'specialization'=> 'required_if:role,technician|nullable|string',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'role'     => $request->role,
            'password' => $request->password,
        ]);

        if ($request->role === 'customer') {
            Customer::create([
                'user_id'  => $user->id,
                'address'  => $request->address,
                'latitude' => -6.2 + (rand(-50, 50) / 1000),
                'longitude'=> 106.8 + (rand(-50, 50) / 1000),
            ]);
        } else {
            Technician::create([
                'user_id'        => $user->id,
                'specialization' => $request->specialization,
                'latitude'       => -6.2 + (rand(-50, 50) / 1000),
                'longitude'      => 106.8 + (rand(-50, 50) / 1000),
            ]);
        }

        $token = $user->createToken('servicego')->plainTextToken;

        return response()->json([
            'user'  => $user->load('customer', 'technician'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('servicego')->plainTextToken;

        return response()->json([
            'user'  => $user->load('customer', 'technician', 'admin'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('customer', 'technician', 'admin'));
    }
}
