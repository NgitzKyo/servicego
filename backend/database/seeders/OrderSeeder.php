<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Rating;
use App\Models\Service;
use App\Models\Sparepart;
use App\Models\Technician;
use App\Models\Warranty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers   = Customer::all();
        $technicians = Technician::all();
        $services    = Service::all();
        $spareparts  = Sparepart::all();

        $statuses = [
            'menunggu_teknisi', 'menunggu_teknisi',
            'diterima', 'diterima',
            'pengecekan',
            'menunggu_persetujuan', 'menunggu_persetujuan',
            'perbaikan', 'perbaikan',
            'selesai', 'selesai', 'selesai', 'selesai', 'selesai',
            'selesai', 'selesai', 'selesai',
            'dibatalkan',
            'selesai', 'selesai',
        ];

        foreach ($statuses as $i => $status) {
            $customer   = $customers->random();
            $service    = $services->random();
            $technician = ($status === 'menunggu_teknisi') ? null : $technicians->random();
            $laborCost  = ($status === 'menunggu_teknisi') ? 0 : rand(50, 150) * 1000;

            $order = Order::create([
                'order_code'          => 'SG-' . now()->subDays(20 - $i)->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'customer_id'         => $customer->id,
                'technician_id'       => $technician?->id,
                'service_id'          => $service->id,
                'order_type'          => rand(0, 1) ? 'home_service' : 'pickup_dropoff',
                'problem_description' => 'Keluhan demo untuk layanan ' . $service->name,
                'address'             => $customer->address,
                'latitude'            => $customer->latitude,
                'longitude'           => $customer->longitude,
                'status'              => $status,
                'labor_cost'          => $laborCost,
                'is_approved_by_customer' => in_array($status, ['perbaikan', 'selesai']),
                'approved_at'         => in_array($status, ['perbaikan', 'selesai']) ? now()->subDays(rand(1, 15)) : null,
                'payment_status'      => match (true) {
                    $status === 'selesai'   => 'dana_diteruskan',
                    $status === 'perbaikan' => 'dana_ditahan',
                    default                 => 'belum_dibayar',
                },
                'completed_at'        => $status === 'selesai' ? now()->subDays(rand(1, 10)) : null,
                'created_at'          => now()->subDays(20 - $i),
                'updated_at'          => now()->subDays(20 - $i),
            ]);

            // Add spareparts for orders past diagnosis
            $partsTotal = 0;
            if (!in_array($status, ['menunggu_teknisi', 'diterima'])) {
                $partCount = rand(0, 2);
                for ($p = 0; $p < $partCount; $p++) {
                    $part     = $spareparts->random();
                    $qty      = rand(1, 2);
                    $subtotal = $part->price * $qty;
                    $partsTotal += $subtotal;

                    OrderDetail::create([
                        'order_id'    => $order->id,
                        'sparepart_id'=> $part->id,
                        'qty'         => $qty,
                        'price'       => $part->price,
                        'subtotal'    => $subtotal,
                    ]);
                }
            }

            $estimated = $laborCost + $partsTotal;
            $order->update([
                'estimated_cost' => $estimated,
                'final_cost'     => $status === 'selesai' ? $estimated : 0,
            ]);

            // Warranty + rating for completed orders
            if ($status === 'selesai') {
                $completedAt = $order->completed_at ?? now()->subDays(rand(1, 10));

                Warranty::create([
                    'order_id'  => $order->id,
                    'start_date'=> $completedAt->toDateString(),
                    'end_date'  => $completedAt->addDays(30)->toDateString(),
                    'status'    => 'aktif',
                ]);

                if (rand(0, 1) && $order->technician_id) {
                    Rating::create([
                        'order_id'      => $order->id,
                        'customer_id'   => $order->customer_id,
                        'technician_id' => $order->technician_id,
                        'score'         => rand(4, 5),
                        'review'        => 'Teknisi profesional dan cepat.',
                    ]);
                }
            }
        }

        // Recalculate rating_avg for each technician
        foreach (Technician::all() as $tech) {
            $avg = Rating::where('technician_id', $tech->id)->avg('score');
            if ($avg) {
                $tech->update(['rating_avg' => round($avg, 2)]);
            }
        }
    }
}
