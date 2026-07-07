<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = ['order_id', 'customer_id', 'technician_id', 'score', 'review'];
    protected $casts = ['score' => 'integer'];

    public function order()      { return $this->belongsTo(Order::class); }
    public function technician() { return $this->belongsTo(Technician::class); }
}
