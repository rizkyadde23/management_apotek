<?php

namespace App\Repositories;

use App\Models\Transaction;

class TransactionRepository
{
    public function paginate()
    {
        return Transaction::with([
            'user',
            'details.medicine'
        ])
        ->latest()
        ->paginate(10);
    }

    public function find(int $id)
    {
        return Transaction::with([
            'user',
            'details.medicine'
        ])
        ->findOrFail($id);
    }

    public function create(array $data)
    {
        return Transaction::create($data);
    }
}