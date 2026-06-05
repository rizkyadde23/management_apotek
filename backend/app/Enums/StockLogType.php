<?php

namespace App\Enums;

enum StockLogType: string
{
    case IN = 'IN';

    case OUT = 'OUT';

    case ADJUSTMENT = 'ADJUSTMENT';

    case EXPIRED = 'EXPIRED';

    public static function values(): array
    {
        return array_column(
            self::cases(),
            'value'
        );
    }
}