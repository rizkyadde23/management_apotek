<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CASH = 'CASH';

    case QRIS = 'QRIS';

    case TRANSFER = 'TRANSFER';

    case E_WALLET = 'E_WALLET';

    public static function values(): array
    {
        return array_column(
            self::cases(),
            'value'
        );
    }
}