<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sparepart extends Model
{
    protected $fillable = ['name', 'price', 'stock', 'unit'];
    protected $casts = ['price' => 'integer'];
}
