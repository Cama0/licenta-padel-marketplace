<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'description',
        'price',
        'type',
        'condition_grade',
        'stock',
        'image_url',
        'is_active',
        // specificatii tehnice
        'shape',
        'weight_range',
        'balance',
        'thickness_mm',
        'frame_material',
        'surface_material',
        'core_material',
        'core_hardness',
        'finish',
        'playing_level',
        'playing_style',
        'sweet_spot',
        'power_rating',
        'control_rating',
        'spin_rating',
        'comfort_rating',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'thickness_mm' => 'integer',
            'power_rating' => 'integer',
            'control_rating' => 'integer',
            'spin_rating' => 'integer',
            'comfort_rating' => 'integer',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // media rating + numarul de recenzii aprobate
    public function scopeWithReviewStats($query)
    {
        return $query
            ->withAvg(['reviews as reviews_avg_rating' => fn($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews as reviews_count' => fn($q) => $q->where('is_approved', true)]);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNew($query)
    {
        return $query->where('type', 'new');
    }

    public function scopeRefurbished($query)
    {
        return $query->where('type', 'refurbished');
    }
}
