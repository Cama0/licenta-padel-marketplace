<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->unsignedTinyInteger('rating'); // 1-5
            $table->string('title')->nullable();
            $table->text('comment');

            // Marcat automat daca user-ul are o comanda delivered cu acest produs
            $table->boolean('is_verified_purchase')->default(false);

            // Moderare - admin poate ascunde recenzii abuzive
            $table->boolean('is_approved')->default(true);

            $table->timestamps();

            // Un user nu poate scrie mai mult de o recenzie per produs
            $table->unique(['user_id', 'product_id']);
            $table->index('product_id');
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
