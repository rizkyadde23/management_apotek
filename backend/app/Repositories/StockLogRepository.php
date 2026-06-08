<?php

namespace App\Repositories;

use App\Models\StockLog;

class StockLogRepository
{
    public function create(array $data)
    {
        return StockLog::create($data);
    }

    public function paginate()
    {
        return StockLog::with([
            'medicine',
            'user'
        ])
        ->latest()
        ->paginate(10);
    }
}