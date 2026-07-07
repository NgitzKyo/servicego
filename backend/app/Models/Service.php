<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['name', 'category', 'description', 'base_price', 'is_active'];
    protected $casts = ['is_active' => 'boolean', 'base_price' => 'integer'];
}
