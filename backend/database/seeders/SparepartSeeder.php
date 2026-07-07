<?php

namespace Database\Seeders;

use App\Models\Sparepart;
use Illuminate\Database\Seeder;

class SparepartSeeder extends Seeder
{
    public function run(): void
    {
        $parts = [
            ['name' => 'Thermal Paste CPU',      'price' => 25000,  'stock' => 50],
            ['name' => 'RAM DDR4 8GB',            'price' => 350000, 'stock' => 20],
            ['name' => 'SSD 256GB SATA',          'price' => 450000, 'stock' => 15],
            ['name' => 'Keyboard Laptop Generic', 'price' => 150000, 'stock' => 10],
            ['name' => 'Baterai HP Generic',      'price' => 120000, 'stock' => 30],
            ['name' => 'LCD iPhone 11',           'price' => 600000, 'stock' => 8],
            ['name' => 'LCD Samsung A51',         'price' => 450000, 'stock' => 8],
            ['name' => 'Freon AC R32',            'price' => 80000,  'stock' => 40],
            ['name' => 'Tinta Printer Epson',     'price' => 45000,  'stock' => 60],
            ['name' => 'Kapasitor AC 25uF',       'price' => 35000,  'stock' => 25],
        ];

        foreach ($parts as $p) {
            Sparepart::create(array_merge($p, ['unit' => 'pcs']));
        }
    }
}
