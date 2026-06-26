<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'criterion_id',
        'label',
        'price_modifier_type',
        'price_modifier_value',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price_modifier_value' => 'decimal:2',
        ];
    }

    public function criterion()
    {
        return $this->belongsTo(EvaluationCriterion::class, 'criterion_id');
    }
}
