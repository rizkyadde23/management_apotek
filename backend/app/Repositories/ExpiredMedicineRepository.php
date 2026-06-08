<?php

namespace App\Repositories;

use Carbon\Carbon;
use App\Models\Medicine;

class ExpiredMedicineRepository
{
    public function getExpiredMedicines()
    {
        return Medicine::with([
            'category',
            'supplier'
        ])
        ->whereDate(
            'expired_date',
            '<',
            now()
        )
        ->paginate(10);
    }

    public function getExpiringSoon()
    {
        return Medicine::with([
            'category',
            'supplier'
        ])
        ->whereBetween(
            'expired_date',
            [
                now(),
                Carbon::now()->addDays(30)
            ]
        )
        ->paginate(10);
    }

    public function countExpired()
    {
        return Medicine::whereDate(
            'expired_date',
            '<',
            now()
        )->count();
    }

    public function countExpiringSoon()
    {
        return Medicine::whereBetween(
            'expired_date',
            [
                now(),
                Carbon::now()->addDays(30)
            ]
        )->count();
    }
}