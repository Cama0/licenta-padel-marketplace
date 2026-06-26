<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BuybackRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        // statusuri care conteaza la venit
        $validStatuses = ['confirmed', 'processing', 'shipped', 'delivered'];

        $kpis = [
            'total_revenue' => (float) Order::whereIn('status', $validStatuses)->sum('total'),
            'total_orders' => Order::count(),
            'orders_today' => Order::whereDate('created_at', today())->count(),
            'orders_this_month' => Order::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_customers' => User::where('role', 'user')->count(),
            'total_products' => Product::active()->count(),
            'low_stock_products' => Product::active()->where('stock', '<=', 3)->where('stock', '>', 0)->count(),
            'out_of_stock_products' => Product::active()->where('stock', 0)->count(),
            'pending_buyback' => BuybackRequest::where('status', 'pending')->count(),
            'pending_reviews' => Review::where('is_approved', false)->count(),
            'avg_order_value' => (float) Order::whereIn('status', $validStatuses)->avg('total'),
        ];

        // vanzari pe ultimele 30 zile
        $thirtyDaysAgo = now()->subDays(29)->startOfDay();
        $salesByDay = Order::whereIn('status', $validStatuses)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // umplem zilele lipsa cu 0 ca graficul sa fie continuu
        $salesTimeline = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $entry = $salesByDay->get($date);
            $salesTimeline[] = [
                'date' => $date,
                'date_label' => Carbon::parse($date)->format('d M'),
                'orders' => $entry ? (int) $entry->orders : 0,
                'revenue' => $entry ? (float) $entry->revenue : 0,
            ];
        }

        $orderStatusDistribution = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(fn($row) => [
                'status' => $row->status,
                'label' => $this->orderStatusLabel($row->status),
                'count' => (int) $row->count,
            ])
            ->values();

        // top 5 branduri dupa venit
        $topBrands = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('brands', 'brands.id', '=', 'products.brand_id')
            ->whereIn('orders.status', $validStatuses)
            ->selectRaw('brands.name as brand, SUM(order_items.quantity) as units, SUM(order_items.subtotal) as revenue')
            ->groupBy('brands.id', 'brands.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn($row) => [
                'brand' => $row->brand,
                'units' => (int) $row->units,
                'revenue' => (float) $row->revenue,
            ]);

        // top 5 produse dupa unitati vandute
        $topProducts = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereIn('orders.status', $validStatuses)
            ->selectRaw('order_items.product_name, order_items.product_slug, SUM(order_items.quantity) as units, SUM(order_items.subtotal) as revenue')
            ->groupBy('order_items.product_name', 'order_items.product_slug')
            ->orderByDesc('units')
            ->limit(5)
            ->get()
            ->map(fn($row) => [
                'name' => $row->product_name,
                'slug' => $row->product_slug,
                'units' => (int) $row->units,
                'revenue' => (float) $row->revenue,
            ]);

        $buybackStatusDistribution = BuybackRequest::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(fn($row) => [
                'status' => $row->status,
                'label' => $this->buybackStatusLabel($row->status),
                'count' => (int) $row->count,
            ])
            ->values();

        // ultimele 5 comenzi
        $recentOrders = Order::with('user:id,name')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'order_number', 'user_id', 'status', 'total', 'created_at', 'shipping_name']);

        return response()->json([
            'kpis' => $kpis,
            'sales_timeline' => $salesTimeline,
            'order_status_distribution' => $orderStatusDistribution,
            'top_brands' => $topBrands,
            'top_products' => $topProducts,
            'buyback_status_distribution' => $buybackStatusDistribution,
            'recent_orders' => $recentOrders,
        ]);
    }

    private function orderStatusLabel(string $status): string
    {
        return match ($status) {
            'pending' => 'Plasata',
            'confirmed' => 'Confirmata',
            'processing' => 'In procesare',
            'shipped' => 'Expediata',
            'delivered' => 'Livrata',
            'cancelled' => 'Anulata',
            default => $status,
        };
    }

    private function buybackStatusLabel(string $status): string
    {
        return match ($status) {
            'pending' => 'In asteptare',
            'accepted' => 'Acceptata',
            'rejected' => 'Respinsa',
            'completed' => 'Finalizata',
            default => $status,
        };
    }
}
