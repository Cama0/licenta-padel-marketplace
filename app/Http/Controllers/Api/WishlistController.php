<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $products = $request->user()
            ->wishlistProducts()
            ->with(['brand', 'category'])
            ->withReviewStats()
            ->orderByDesc('wishlists.created_at')
            ->get();

        return response()->json($products);
    }

    public function store(Request $request, Product $product)
    {
        Wishlist::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'message' => 'Produsul a fost adaugat in wishlist.',
            'in_wishlist' => true,
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        return response()->json([
            'message' => 'Produsul a fost scos din wishlist.',
            'in_wishlist' => false,
        ]);
    }

    // adauga sau sterge intr-un singur endpoint
    public function toggle(Request $request, Product $product)
    {
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'message' => 'Produsul a fost scos din wishlist.',
                'in_wishlist' => false,
            ]);
        }

        Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'message' => 'Produsul a fost adaugat in wishlist.',
            'in_wishlist' => true,
        ]);
    }

    // doar ID-urile, folosit la login ca sa populam frontend-ul rapid
    public function ids(Request $request)
    {
        $ids = Wishlist::where('user_id', $request->user()->id)
            ->pluck('product_id');

        return response()->json($ids);
    }
}
