<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $fillable = ['order_id', 'sparepart_id', 'qty', 'price', 'subtotal'];

    public function sparepart()
    {
        return $this->belongsTo(Sparepart::class);
    }
}
