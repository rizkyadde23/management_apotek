<?php

namespace App\Enums;

enum MedicineType: string
{
    case GENERIC = 'GENERIC';

    case NON_GENERIC = 'NON_GENERIC';

    public static function values(): array
    {
        return array_column(
            self::cases(),
            'value'
        );
    }
}