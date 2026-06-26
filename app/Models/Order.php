<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'shipping_cost',
        'total',
        'shipping_name',
        'shipping_phone',
        'shipping_email',
        'shipping_address',
        'shipping_city',
        'shipping_postal_code',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // format CMD-YYYYMMDD-XXXX
    public static function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "CMD-{$date}-";

        $lastNumber = self::where('order_number', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->value('order_number');

        if ($lastNumber) {
            $lastSeq = (int) substr($lastNumber, strlen($prefix));
            $newSeq = $lastSeq + 1;
        } else {
            $newSeq = 1;
        }

        return $prefix . str_pad($newSeq, 4, '0', STR_PAD_LEFT);
    }
}
