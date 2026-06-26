<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluation_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('criterion_id')->constrained('evaluation_criteria')->onDelete('cascade');
            $table->string('label');
            $table->string('price_modifier_type', 20); // 'percentage' or 'fixed_amount'
            $table->decimal('price_modifier_value', 10, 2)->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluation_options');
    }
};
