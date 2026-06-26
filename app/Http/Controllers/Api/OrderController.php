<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderPlacedMail;
use App\Mail\OrderStatusChangedMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    // creeaza comanda intr-o tranzactie ca sa fie atomica
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:50',
            'shipping_name' => 'required|string|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_email' => 'required|email|max:255',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:100',
            'shipping_postal_code' => 'nullable|string|max:20',
            'payment_method' => 'required|in:card,cash_on_delivery,bank_transfer',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $order = DB::transaction(function () use ($validated, $request) {
                $subtotal = 0;
                $itemsToCreate = [];

                foreach ($validated['items'] as $item) {
                    // lock pesimist ca sa nu vanda doi useri ultimul produs din stoc
                    $product = Product::lockForUpdate()->find($item['product_id']);

                    if (!$product || !$product->is_active) {
                        throw new \Exception("Produsul cu ID {$item['product_id']} nu mai este disponibil.");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stoc insuficient pentru '{$product->name}' (disponibil: {$product->stock}, cerut: {$item['quantity']}).");
                    }

                    $itemSubtotal = $product->price * $item['quantity'];
                    $subtotal += $itemSubtotal;

                    $itemsToCreate[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'subtotal' => $itemSubtotal,
                    ];
                }

                // transport gratuit peste 500 ron
                $shippingCost = $subtotal >= 500 ? 0 : 25;
                $total = $subtotal + $shippingCost;

                $order = Order::create([
                    'order_number' => Order::generateOrderNumber(),
                    'user_id' => $request->user()?->id,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                    'payment_method' => $validated['payment_method'],
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'shipping_name' => $validated['shipping_name'],
                    'shipping_phone' => $validated['shipping_phone'],
                    'shipping_email' => $validated['shipping_email'],
                    'shipping_address' => $validated['shipping_address'],
                    'shipping_city' => $validated['shipping_city'],
                    'shipping_postal_code' => $validated['shipping_postal_code'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                ]);

                foreach ($itemsToCreate as $item) {
                    $product = $item['product'];

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_slug' => $product->slug,
                        'product_image_url' => $product->image_url,
                        'unit_price' => $product->price,
                        'quantity' => $item['quantity'],
                        'subtotal' => $item['subtotal'],
                    ]);

                    $product->decrement('stock', $item['quantity']);
                }

                return $order->load('items');
            });

            // email in afara tranzactiei ca sa nu strice comanda daca esueaza
            $this->safeMail($order->shipping_email, new OrderPlacedMail($order));

            return response()->json([
                'message' => 'Comanda a fost plasata cu succes!',
                'order' => $order,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function downloadInvoice(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Nu aveti acces la aceasta comanda.'], 403);
        }

        $order->load('items');

        $pdf = Pdf::loadView('pdfs.order-invoice', [
            'order' => $order,
            'documentTitle' => "Factura {$order->order_number}",
        ])->setPaper('a4');

        $filename = "factura-{$order->order_number}.pdf";
        return $pdf->download($filename);
    }

    // trimite email cu try/catch ca sa nu blocheze fluxul
    private function safeMail(string $to, $mailable): void
    {
        try {
            Mail::to($to)->send($mailable);
        } catch (\Exception $e) {
            Log::warning('Email send failed: ' . $e->getMessage(), [
                'to' => $to,
                'mailable' => get_class($mailable),
            ]);
        }
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Nu aveti acces la aceasta comanda.'], 403);
        }

        return response()->json($order->load('items'));
    }

    public function myOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }

    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'items'])->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }
        if ($request->search) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'ilike', $search)
                    ->orWhere('shipping_name', 'ilike', $search)
                    ->orWhere('shipping_email', 'ilike', $search);
            });
        }

        return response()->json($query->paginate(20));
    }

    public function adminShow(Order $order)
    {
        return response()->json($order->load(['user', 'items']));
    }

    public function adminUpdate(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'nullable|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|in:pending,paid,failed,refunded',
        ]);

        $previousStatus = $order->status;

        // la anulare punem stocul inapoi
        if (isset($validated['status']) && $validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
            DB::transaction(function () use ($order) {
                foreach ($order->items as $item) {
                    if ($item->product_id) {
                        Product::where('id', $item->product_id)->increment('stock', $item->quantity);
                    }
                }
            });
        }

        $order->update($validated);

        if (isset($validated['status']) && $validated['status'] !== $previousStatus) {
            $this->safeMail(
                $order->shipping_email,
                new OrderStatusChangedMail($order->fresh(), $previousStatus)
            );
        }

        return response()->json([
            'message' => 'Comanda a fost actualizata.',
            'order' => $order->fresh()->load(['user', 'items']),
        ]);
    }
}
