<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warranty extends Model
{
    const WARRANTY_DAYS = 30;

    protected $fillable = ['order_id', 'start_date', 'end_date', 'status', 'claim_order_id'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date'];

    public function order()      { return $this->belongsTo(Order::class); }
    public function claimOrder() { return $this->belongsTo(Order::class, 'claim_order_id'); }

    public function isExpired(): bool
    {
        return now()->isAfter($this->end_date);
    }
}
