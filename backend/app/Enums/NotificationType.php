<?php

namespace App\Enums;

enum NotificationType: string
{
    case LOW_STOCK = 'LOW_STOCK';
    case EXPIRED = 'EXPIRED';
    case PREORDER = 'PREORDER';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}