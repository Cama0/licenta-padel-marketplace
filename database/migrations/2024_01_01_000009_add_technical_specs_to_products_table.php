<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Specificații tehnice rachetă
            $table->string('shape', 30)->nullable()->after('image_url');           // round, teardrop, diamond, geometric
            $table->string('weight_range', 30)->nullable()->after('shape');        // ex: "360-375"
            $table->string('balance', 20)->nullable()->after('weight_range');      // low, medium, high
            $table->integer('thickness_mm')->nullable()->after('balance');         // ex: 38
            $table->string('frame_material', 50)->nullable()->after('thickness_mm'); // carbon, fiberglass, etc.
            $table->string('surface_material', 50)->nullable()->after('frame_material'); // 3K carbon, 12K carbon, 24K carbon, fiberglass
            $table->string('core_material', 50)->nullable()->after('surface_material'); // EVA soft, EVA medium, EVA hard, FOAM
            $table->string('core_hardness', 20)->nullable()->after('core_material'); // soft, medium, hard
            $table->string('finish', 20)->nullable()->after('core_hardness');       // rough, smooth
            $table->string('playing_level', 30)->nullable()->after('finish');       // beginner, intermediate, advanced, professional
            $table->string('playing_style', 30)->nullable()->after('playing_level'); // control, allround, attack
            $table->string('sweet_spot', 20)->nullable()->after('playing_style');   // small, medium, large
            $table->integer('power_rating')->nullable()->after('sweet_spot');       // 1-10
            $table->integer('control_rating')->nullable()->after('power_rating');   // 1-10
            $table->integer('spin_rating')->nullable()->after('control_rating');    // 1-10
            $table->integer('comfort_rating')->nullable()->after('spin_rating');    // 1-10

            // Index-uri pentru filtrare rapidă
            $table->index('shape');
            $table->index('balance');
            $table->index('playing_level');
            $table->index('playing_style');
            $table->index('core_hardness');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['shape']);
            $table->dropIndex(['balance']);
            $table->dropIndex(['playing_level']);
            $table->dropIndex(['playing_style']);
            $table->dropIndex(['core_hardness']);

            $table->dropColumn([
                'shape', 'weight_range', 'balance', 'thickness_mm',
                'frame_material', 'surface_material', 'core_material', 'core_hardness',
                'finish', 'playing_level', 'playing_style', 'sweet_spot',
                'power_rating', 'control_rating', 'spin_rating', 'comfort_rating',
            ]);
        });
    }
};
