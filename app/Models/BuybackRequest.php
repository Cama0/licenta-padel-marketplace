<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuybackRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'padel_racket_id',
        'offered_price',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'offered_price' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function padelRacket()
    {
        return $this->belongsTo(PadelRacket::class);
    }

    public function answers()
    {
        return $this->hasMany(BuybackRequestAnswer::class);
    }

    public function selectedOptions()
    {
        return $this->belongsToMany(
            EvaluationOption::class,
            'buyback_request_answers',
            'buyback_request_id',
            'evaluation_option_id'
        );
    }
}
