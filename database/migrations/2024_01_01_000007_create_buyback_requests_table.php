<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buyback_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('padel_racket_id')->constrained('padel_rackets')->onDelete('cascade');
            $table->decimal('offered_price', 10, 2);
            $table->string('status', 20)->default('pending'); // pending, accepted, rejected, completed
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buyback_requests');
    }
};
