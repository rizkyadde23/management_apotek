<?php

namespace App\Repositories;

use Carbon\Carbon;
use App\Models\Medicine;
use App\Models\NotificationSetting;

class ExpiredMedicineRepository
{
    private function warningDays()
    {
        return NotificationSetting::first()?->expired_warning_days ?? 30;
    }

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
                    Carbon::now()->addDays(
                        $this->warningDays()
                    )
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
                Carbon::now()->addDays(
                    $this->warningDays()
                )
            ]
        )->count();
    }

    public function dashboard()
    {
        return Medicine::select(

                'id',

                'name',

                'expired_date'

            )

            ->whereBetween(

                'expired_date',

                [

                    now(),

                    now()->addDays(30)

                ]

            )

            ->orderBy('expired_date')

            ->limit(5)

            ->get();
    }
}