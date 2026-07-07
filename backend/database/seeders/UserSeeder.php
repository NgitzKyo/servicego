<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Customer;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Required admin account
        $admin = User::create([
            'name'     => 'Admin ServiceGo',
            'email'    => 'admin@servicego.com',
            'phone'    => '081200000001',
            'role'     => 'admin',
            'password' => Hash::make('password'),
        ]);
        Admin::create(['user_id' => $admin->id]);

        // Required customer account
        $customer = User::create([
            'name'     => 'Customer Demo',
            'email'    => 'customer@servicego.com',
            'phone'    => '081300000001',
            'role'     => 'customer',
            'password' => Hash::make('password'),
        ]);
        Customer::create([
            'user_id'  => $customer->id,
            'address'  => 'Jl. Sudirman No. 1, Jakarta Pusat',
            'latitude' => -6.2088,
            'longitude'=> 106.8456,
        ]);

        // Required technician account
        $tech = User::create([
            'name'     => 'Teknisi Demo',
            'email'    => 'technician@servicego.com',
            'phone'    => '081400000001',
            'role'     => 'technician',
            'password' => Hash::make('password'),
        ]);
        Technician::create([
            'user_id'        => $tech->id,
            'specialization' => 'Laptop & PC',
            'bio'            => 'Teknisi berpengalaman lebih dari 5 tahun.',
            'status'         => 'online',
            'is_verified'    => true,
            'latitude'       => -6.2100,
            'longitude'      => 106.8400,
            'rating_avg'     => 4.8,
            'total_jobs'     => 25,
        ]);

        // Additional 4 technicians (berbeda spesialisasi)
        $extras = [
            ['name' => 'Teknisi Printer',     'email' => 'teknisi2@servicego.com', 'spec' => 'Printer',                  'lat' => -6.195,  'lng' => 106.850],
            ['name' => 'Teknisi AC',          'email' => 'teknisi3@servicego.com', 'spec' => 'AC',                       'lat' => -6.220,  'lng' => 106.835],
            ['name' => 'Teknisi Smartphone',  'email' => 'teknisi4@servicego.com', 'spec' => 'Smartphone',               'lat' => -6.230,  'lng' => 106.860],
            ['name' => 'Teknisi Elektronik',  'email' => 'teknisi5@servicego.com', 'spec' => 'Elektronik Rumah Tangga',  'lat' => -6.205,  'lng' => 106.870],
        ];

        foreach ($extras as $i => $data) {
            $u = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'phone'    => '08140000000' . ($i + 2),
                'role'     => 'technician',
                'password' => Hash::make('password'),
            ]);
            Technician::create([
                'user_id'        => $u->id,
                'specialization' => $data['spec'],
                'status'         => 'online',
                'is_verified'    => true,
                'latitude'       => $data['lat'],
                'longitude'      => $data['lng'],
                'rating_avg'     => round(rand(38, 50) / 10, 2),
                'total_jobs'     => rand(5, 40),
            ]);
        }

        // Additional 4 customers
        $cities = ['Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'];
        for ($i = 2; $i <= 5; $i++) {
            $u = User::create([
                'name'     => "Customer $i",
                'email'    => "customer{$i}@servicego.com",
                'phone'    => '08130000000' . $i,
                'role'     => 'customer',
                'password' => Hash::make('password'),
            ]);
            Customer::create([
                'user_id'  => $u->id,
                'address'  => 'Jl. Contoh No. ' . $i . ', ' . $cities[$i % 4],
                'latitude' => -6.2 + (rand(-50, 50) / 1000),
                'longitude'=> 106.8 + (rand(-50, 50) / 1000),
            ]);
        }
    }
}
