<?php

namespace App\Repositories;

use App\Models\Transaction;

class InvoiceRepository
{
    public function getInvoiceData($id)
    {
        // Pastikan relasi items, medicine, dan user ikut terambil
        return Transaction::with(['items.medicine', 'user'])->findOrFail($id);
    }
}