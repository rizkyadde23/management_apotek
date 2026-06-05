<?php

namespace App\Enums;

enum PreOrderStatus: string
{
    case PENDING = 'PENDING';
    case READY = 'READY';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}