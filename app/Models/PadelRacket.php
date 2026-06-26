<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PadelRacket extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'model',
        'base_buyback_price',
        'image_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'base_buyback_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function buybackRequests()
    {
        return $this->hasMany(BuybackRequest::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
