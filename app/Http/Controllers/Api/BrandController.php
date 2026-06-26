<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index()
    {
        return response()->json(Brand::orderBy('name')->get());
    }

    public function show(Brand $brand)
    {
        return response()->json($brand);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:brands',
            'logo_url' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $brand = Brand::create($validated);

        return response()->json($brand, 201);
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:brands,slug,' . $brand->id,
            'logo_url' => 'nullable|string|max:255',
        ]);

        $brand->update($validated);

        return response()->json($brand);
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();

        return response()->json(['message' => 'Brand șters cu succes.']);
    }
}
