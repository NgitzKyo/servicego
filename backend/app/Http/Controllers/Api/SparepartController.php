<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sparepart;
use Illuminate\Http\Request;

class SparepartController extends Controller
{
    public function index()
    {
        return response()->json(Sparepart::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'unit'  => 'nullable|string',
        ]);

        return response()->json(Sparepart::create($request->all()), 201);
    }

    public function update(Request $request, Sparepart $sparepart)
    {
        $sparepart->update($request->all());
        return response()->json($sparepart);
    }

    public function destroy(Sparepart $sparepart)
    {
        $sparepart->delete();
        return response()->json(['message' => 'Sparepart dihapus.']);
    }
}
