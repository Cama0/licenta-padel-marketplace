<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Product $product)
    {
        $reviews = $product->reviews()
            ->approved()
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->get();

        // cate recenzii pentru fiecare nota 1-5
        $distribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $distribution[$i] = $product->reviews()->approved()->where('rating', $i)->count();
        }

        return response()->json([
            'reviews' => $reviews,
            'average' => round((float) $product->reviews()->approved()->avg('rating'), 1),
            'total' => $product->reviews()->approved()->count(),
            'distribution' => $distribution,
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10|max:2000',
        ]);

        $userId = $request->user()->id;

        // un user nu poate scrie mai mult de o recenzie per produs
        if (Review::where('user_id', $userId)->where('product_id', $product->id)->exists()) {
            return response()->json([
                'message' => 'Ai scris deja o recenzie pentru acest produs. O poti edita.',
            ], 422);
        }

        // verified purchase daca a primit produsul
        $hasPurchased = Order::where('user_id', $userId)
            ->where('status', 'delivered')
            ->whereHas('items', fn($q) => $q->where('product_id', $product->id))
            ->exists();

        $review = Review::create([
            'user_id' => $userId,
            'product_id' => $product->id,
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'comment' => $validated['comment'],
            'is_verified_purchase' => $hasPurchased,
            'is_approved' => true,
        ]);

        return response()->json([
            'message' => 'Multumim pentru recenzie!',
            'review' => $review->load('user:id,name'),
        ], 201);
    }

    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Nu ai dreptul sa editezi aceasta recenzie.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10|max:2000',
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Recenzia a fost actualizata.',
            'review' => $review->fresh()->load('user:id,name'),
        ]);
    }

    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Nu ai dreptul sa stergi aceasta recenzie.'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Recenzia a fost stearsa.']);
    }

    public function myReviewForProduct(Request $request, Product $product)
    {
        $review = Review::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        return response()->json([
            'has_review' => (bool) $review,
            'review' => $review,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $query = Review::with(['user:id,name,email', 'product:id,name,slug'])
            ->orderByDesc('created_at');

        if ($request->status === 'pending') {
            $query->where('is_approved', false);
        } elseif ($request->status === 'approved') {
            $query->where('is_approved', true);
        }

        return response()->json($query->paginate(20));
    }

    public function adminUpdate(Request $request, Review $review)
    {
        $validated = $request->validate([
            'is_approved' => 'required|boolean',
        ]);

        $review->update($validated);

        return response()->json([
            'message' => $validated['is_approved'] ? 'Recenzia a fost aprobata.' : 'Recenzia a fost ascunsa.',
            'review' => $review->fresh()->load(['user:id,name,email', 'product:id,name,slug']),
        ]);
    }

    public function adminDestroy(Review $review)
    {
        $review->delete();
        return response()->json(['message' => 'Recenzia a fost stearsa.']);
    }
}
