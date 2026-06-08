<?php

namespace App\Enums;

enum ExpiredMedicineAlertType: string
{
    case CRITICAL = 'CRITICAL';
    case WARNING = 'WARNING';
    case INFO = 'INFO';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
