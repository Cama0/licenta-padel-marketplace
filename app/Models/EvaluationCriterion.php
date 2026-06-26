<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationCriterion extends Model
{
    use HasFactory;

    protected $table = 'evaluation_criteria';

    protected $fillable = ['name', 'description', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function options()
    {
        return $this->hasMany(EvaluationOption::class, 'criterion_id')->orderBy('sort_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
