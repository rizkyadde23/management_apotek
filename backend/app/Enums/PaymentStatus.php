<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PAID = 'PAID';
    case UNPAID = 'UNPAID';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}