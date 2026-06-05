<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        Supplier::insert([
            [
                'name' => 'PT Kimia Farma',
                'phone' => '02112345678',
                'email' => 'supplier@kimiafarma.co.id',
                'address' => 'Jakarta'
            ],
            [
                'name' => 'PT Kalbe Farma',
                'phone' => '02187654321',
                'email' => 'supplier@kalbe.co.id',
                'address' => 'Jakarta'
            ]
        ]);
    }
}