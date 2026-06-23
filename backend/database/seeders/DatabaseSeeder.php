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
        if (User::count() == 0) {
            // Contoh jika memanggil seeder lain:
            $this->call([AdminSeeder::class,]);
        }
        $this->call([
            RoleSeeder::class,
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
