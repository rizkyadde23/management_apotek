<?php

namespace App\Enums;

enum ExpiredMedicineAlertStatus: string
{
    case PENDING = 'PENDING';
    case ACKNOWLEDGED = 'ACKNOWLEDGED';
    case RESOLVED = 'RESOLVED';
    case DISMISSED = 'DISMISSED';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
