<?php

namespace App\Repositories;

use App\Models\Transaction;

class InvoiceRepository
{
    public function getInvoiceData($transaction_id)
    {
        // Ganti 'medicines' menjadi 'items.medicine' dan 'user'
        // Ini memastikan tabel pivot/item dan nama kasir ikut terbawa ke Blade
        return Transaction::with(['items.medicine', 'user'])->findOrFail($transaction_id);
    }
}