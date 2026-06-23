<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // SEMUA seeder dimasukkan ke dalam kondisi ini.
        // Jika sudah ada minimal 1 user di database, proses seeding akan dilewati sepenuhnya.
        if (User::count() == 0) {
            $this->call([
                RoleSeeder::class, // Diatur ke urutan pertama jika AdminSeeder membutuhkan data Role
                AdminSeeder::class, 
                MedicineCategorySeeder::class,
                SupplierSeeder::class,
                MedicineSeeder::class,
                PreOrderSeeder::class,
                TransactionSeeder::class,
                TransactionDetailSeeder::class,
                PaymentSeeder::class,
                NotificationSeeder::class,
                PurchaseOrderSeeder::class,
                NotificationSettingSeeder::class,
            ]);
        }
    }
}