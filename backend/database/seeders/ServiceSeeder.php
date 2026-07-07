<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            // Laptop
            ['name' => 'Service Laptop Mati Total',   'category' => 'Laptop',                   'description' => 'Diagnosa dan perbaikan laptop yang tidak bisa menyala.',       'base_price' => 150000],
            ['name' => 'Ganti Keyboard Laptop',        'category' => 'Laptop',                   'description' => 'Penggantian keyboard laptop yang rusak atau ada tombol macet.',  'base_price' => 100000],
            ['name' => 'Upgrade RAM / SSD Laptop',     'category' => 'Laptop',                   'description' => 'Upgrade memori RAM atau ganti ke storage SSD.',                  'base_price' => 75000],
            // PC
            ['name' => 'Servis PC Tidak Menyala',      'category' => 'PC',                       'description' => 'Diagnosa dan perbaikan PC / komputer desktop.',                   'base_price' => 150000],
            ['name' => 'Pemasangan Komponen PC',       'category' => 'PC',                       'description' => 'Instalasi prosesor, RAM, GPU, atau storage baru.',                'base_price' => 100000],
            // Printer
            ['name' => 'Servis Printer Tidak Cetak',   'category' => 'Printer',                  'description' => 'Perbaikan printer yang macet, tidak cetak, atau print putus.',     'base_price' => 100000],
            ['name' => 'Isi Tinta / Toner Printer',    'category' => 'Printer',                  'description' => 'Pengisian ulang tinta inkjet atau toner laser.',                   'base_price' => 50000],
            // AC
            ['name' => 'Cuci / Service AC',            'category' => 'AC',                       'description' => 'Pembersihan AC split secara menyeluruh termasuk freon cek.',       'base_price' => 150000],
            ['name' => 'Tambah Freon AC',               'category' => 'AC',                       'description' => 'Penambahan freon AC yang kurang dingin.',                          'base_price' => 200000],
            // Smartphone
            ['name' => 'Ganti LCD / Touchscreen',      'category' => 'Smartphone',               'description' => 'Penggantian layar HP yang pecah atau touchscreen tidak responsif.', 'base_price' => 200000],
            ['name' => 'Service HP Mati / Bootloop',   'category' => 'Smartphone',               'description' => 'Perbaikan HP yang mati total atau stuck di logo.',                  'base_price' => 150000],
            ['name' => 'Ganti Baterai HP',              'category' => 'Smartphone',               'description' => 'Penggantian baterai HP yang sudah bocor atau drop.',                'base_price' => 100000],
            // Elektronik Rumah Tangga
            ['name' => 'Servis Mesin Cuci',            'category' => 'Elektronik Rumah Tangga',  'description' => 'Perbaikan mesin cuci yang tidak berputar atau bocor.',              'base_price' => 150000],
            ['name' => 'Servis Kulkas Tidak Dingin',   'category' => 'Elektronik Rumah Tangga',  'description' => 'Perbaikan kulkas 1 atau 2 pintu yang tidak dingin.',                'base_price' => 150000],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
