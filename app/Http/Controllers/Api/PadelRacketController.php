<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PadelRacket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PadelRacketController extends Controller
{
    public function index(Request $request)
    {
        $query = PadelRacket::with('brand')->active();

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        return response()->json($query->orderBy('model')->get());
    }

    public function show(PadelRacket $padelRacket)
    {
        return response()->json($padelRacket->load('brand'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'base_buyback_price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('padel-rackets', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']);

        $racket = PadelRacket::create($validated);

        return response()->json($racket->load('brand'), 201);
    }

    public function update(Request $request, PadelRacket $padelRacket)
    {
        $validated = $request->validate([
            'brand_id' => 'sometimes|required|exists:brands,id',
            'model' => 'sometimes|required|string|max:255',
            'base_buyback_price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'remove_image' => 'nullable|boolean',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // stergem poza veche
            if ($padelRacket->image_url && str_starts_with($padelRacket->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $padelRacket->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('padel-rackets', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        if ($request->boolean('remove_image')) {
            if ($padelRacket->image_url && str_starts_with($padelRacket->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $padelRacket->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['image_url'] = null;
        }

        unset($validated['image'], $validated['remove_image']);

        $padelRacket->update($validated);

        return response()->json($padelRacket->load('brand'));
    }

    public function destroy(PadelRacket $padelRacket)
    {
        if ($padelRacket->image_url && str_starts_with($padelRacket->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $padelRacket->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $padelRacket->delete();

        return response()->json(['message' => 'Racheta stearsa cu succes.']);
    }

    public function adminIndex()
    {
        return response()->json(PadelRacket::with('brand')->orderBy('model')->get());
    }
}
