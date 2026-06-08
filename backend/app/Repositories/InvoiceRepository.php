<?php

namespace App\Repositories;

use App\Models\Transaction;

class InvoiceRepository
{
    public function findByTransaction(int $id)
    {
        return Transaction::with([
            'user',
            'details.medicine',
            'payment'
        ])
        ->findOrFail($id);
    }
}