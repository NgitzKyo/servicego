<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_code', 'customer_id', 'technician_id', 'service_id',
        'order_type', 'problem_description', 'address', 'latitude', 'longitude',
        'status', 'diagnosis_note', 'labor_cost', 'estimated_cost', 'final_cost',
        'is_approved_by_customer', 'approved_at', 'payment_status', 'completed_at',
    ];

    protected $casts = [
        'is_approved_by_customer' => 'boolean',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'labor_cost' => 'integer',
        'estimated_cost' => 'integer',
        'final_cost' => 'integer',
    ];

    public function customer()    { return $this->belongsTo(Customer::class); }
    public function technician()  { return $this->belongsTo(Technician::class); }
    public function service()     { return $this->belongsTo(Service::class); }
    public function details()     { return $this->hasMany(OrderDetail::class); }
    public function warranty()    { return $this->hasOne(Warranty::class); }
    public function rating()      { return $this->hasOne(Rating::class); }
    public function complaints()  { return $this->hasMany(Complaint::class); }
}
