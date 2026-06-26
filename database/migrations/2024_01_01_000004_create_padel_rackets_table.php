<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('padel_rackets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained('brands')->onDelete('cascade');
            $table->string('model');
            $table->decimal('base_buyback_price', 10, 2);
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['brand_id', 'model']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('padel_rackets');
    }
};
