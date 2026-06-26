<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();

            // Produsul - nullable in caz ca produsul e sters din DB ulterior (pastram istoricul)
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();

            // Snapshot date produs (nu se schimba daca produsul e modificat ulterior)
            $table->string('product_name');
            $table->string('product_slug')->nullable();
            $table->string('product_image_url')->nullable();
            $table->decimal('unit_price', 10, 2);

            $table->integer('quantity');
            $table->decimal('subtotal', 10, 2); // unit_price * quantity

            $table->timestamps();

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
