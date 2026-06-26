<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuybackRequestAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyback_request_id',
        'evaluation_option_id',
    ];

    public function buybackRequest()
    {
        return $this->belongsTo(BuybackRequest::class);
    }

    public function evaluationOption()
    {
        return $this->belongsTo(EvaluationOption::class);
    }
}
