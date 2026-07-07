<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technician extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'specialization', 'bio', 'status',
        'is_verified', 'latitude', 'longitude', 'rating_avg', 'total_jobs',
    ];

    protected $casts = ['is_verified' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function distanceTo(float $lat, float $lng): float
    {
        return sqrt(pow($this->latitude - $lat, 2) + pow($this->longitude - $lng, 2)) * 111;
    }
}
