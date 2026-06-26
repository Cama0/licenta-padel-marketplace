<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand'])->withReviewStats()->active();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', $search)
                  ->orWhere('description', 'ilike', $search);
            });
        }

        // filtre multi-select cu whereIn
        $specFilters = [
            'shape' => 'shapes',
            'balance' => 'balances',
            'core_hardness' => 'core_hardnesses',
            'playing_style' => 'playing_styles',
            'playing_level' => 'playing_levels',
        ];

        foreach ($specFilters as $column => $param) {
            $values = $this->normalizeArrayParam($request->input($param));
            if (!empty($values)) {
                $query->whereIn($column, $values);
            }
        }

        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->price_max);
        }

        // rating cu subquery, HAVING nu merge pe withAvg
        if ($request->filled('min_rating')) {
            $minRating = max(1, min(5, (int) $request->min_rating));
            $query->whereRaw(
                '(SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviews.product_id = products.id AND reviews.is_approved = true) >= ?',
                [$minRating]
            );
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = strtolower($request->get('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        switch ($sortBy) {
            case 'price':
                $query->orderBy('price', $sortDir);
                break;
            case 'name':
                $query->orderBy('name', $sortDir);
                break;
            case 'rating':
                $query->orderByRaw('reviews_avg_rating IS NULL, reviews_avg_rating DESC');
                break;
            case 'popular':
                $query->orderByDesc('reviews_count');
                break;
            case 'created_at':
            default:
                $query->orderBy('created_at', $sortDir);
                break;
        }

        return response()->json($query->paginate($request->get('per_page', 12)));
    }

    // accepta array sau csv
    private function normalizeArrayParam($value): array
    {
        if (empty($value)) return [];
        if (is_array($value)) return array_filter($value);
        return array_filter(array_map('trim', explode(',', $value)));
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'brand'])
            ->withReviewStats()
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'type' => 'required|in:new,refurbished',
            'condition_grade' => 'nullable|in:A+,A,B,C',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_active' => 'boolean',
            // specs tehnice pentru advisor si filtre
            'shape' => 'nullable|in:round,teardrop,diamond,geometric',
            'weight_range' => 'nullable|string|max:50',
            'balance' => 'nullable|in:low,medium,high',
            'thickness_mm' => 'nullable|integer|min:0',
            'frame_material' => 'nullable|string|max:100',
            'surface_material' => 'nullable|string|max:100',
            'core_material' => 'nullable|string|max:100',
            'core_hardness' => 'nullable|in:soft,medium,hard',
            'finish' => 'nullable|string|max:50',
            'playing_level' => 'nullable|in:beginner,intermediate,advanced,professional',
            'playing_style' => 'nullable|in:control,allround,attack',
            'sweet_spot' => 'nullable|in:small,medium,large',
            'power_rating' => 'nullable|integer|min:1|max:10',
            'control_rating' => 'nullable|integer|min:1|max:10',
            'spin_rating' => 'nullable|integer|min:1|max:10',
            'comfort_rating' => 'nullable|integer|min:1|max:10',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']);

        $product = Product::create($validated);

        return response()->json($product->load(['category', 'brand']), 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'brand_id' => 'sometimes|required|exists:brands,id',
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'type' => 'sometimes|required|in:new,refurbished',
            'condition_grade' => 'nullable|in:A+,A,B,C',
            'stock' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'remove_image' => 'nullable|boolean',
            'is_active' => 'boolean',
            // specs tehnice pentru advisor si filtre
            'shape' => 'nullable|in:round,teardrop,diamond,geometric',
            'weight_range' => 'nullable|string|max:50',
            'balance' => 'nullable|in:low,medium,high',
            'thickness_mm' => 'nullable|integer|min:0',
            'frame_material' => 'nullable|string|max:100',
            'surface_material' => 'nullable|string|max:100',
            'core_material' => 'nullable|string|max:100',
            'core_hardness' => 'nullable|in:soft,medium,hard',
            'finish' => 'nullable|string|max:50',
            'playing_level' => 'nullable|in:beginner,intermediate,advanced,professional',
            'playing_style' => 'nullable|in:control,allround,attack',
            'sweet_spot' => 'nullable|in:small,medium,large',
            'power_rating' => 'nullable|integer|min:1|max:10',
            'control_rating' => 'nullable|integer|min:1|max:10',
            'spin_rating' => 'nullable|integer|min:1|max:10',
            'comfort_rating' => 'nullable|integer|min:1|max:10',
        ]);

        if ($request->hasFile('image')) {
            // stergem poza veche
            if ($product->image_url && str_starts_with($product->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        if ($request->boolean('remove_image')) {
            if ($product->image_url && str_starts_with($product->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['image_url'] = null;
        }

        unset($validated['image'], $validated['remove_image']);

        $product->update($validated);

        return response()->json($product->load(['category', 'brand']));
    }

    public function destroy(Product $product)
    {
        if ($product->image_url && str_starts_with($product->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $product->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $product->delete();

        return response()->json(['message' => 'Produs sters cu succes.']);
    }

    public function adminIndex(Request $request)
    {
        $query = Product::with(['category', 'brand']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15)));
    }
}
