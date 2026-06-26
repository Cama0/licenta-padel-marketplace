<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // Format: CMD-20260504-0001

            // Userul care a facut comanda (nullable pentru guest checkout viitor)
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Status comanda
            $table->enum('status', [
                'pending',     // tocmai plasata
                'confirmed',   // confirmata de admin
                'processing',  // in procesare/preparare
                'shipped',     // expediata
                'delivered',   // livrata
                'cancelled',   // anulata
            ])->default('pending');

            // Status plata
            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed',
                'refunded',
            ])->default('pending');

            $table->enum('payment_method', [
                'card',          // card online (mock)
                'cash_on_delivery', // ramburs
                'bank_transfer', // transfer bancar
            ])->default('cash_on_delivery');

            // Sume (snapshot la momentul comenzii)
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('total', 10, 2);

            // Adresa livrare (snapshot - nu FK la users.address pentru ca userul poate avea mai multe livrari)
            $table->string('shipping_name');
            $table->string('shipping_phone');
            $table->string('shipping_email');
            $table->string('shipping_address');
            $table->string('shipping_city');
            $table->string('shipping_postal_code')->nullable();

            // Note de la client
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('order_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
