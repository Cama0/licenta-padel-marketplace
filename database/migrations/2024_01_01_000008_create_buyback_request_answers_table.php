<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buyback_request_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyback_request_id')->constrained('buyback_requests')->onDelete('cascade');
            $table->foreignId('evaluation_option_id')->constrained('evaluation_options')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['buyback_request_id', 'evaluation_option_id'], 'buyback_answer_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buyback_request_answers');
    }
};
