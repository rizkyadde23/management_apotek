<?php

namespace App\Enums;

enum ReportType: string
{
    case MEDICINE = 'MEDICINE';
    case SALES = 'SALES';
    case STOCK = 'STOCK';
    case AUDIT_LOG = 'AUDIT_LOG';
    case PURCHASE_ORDER = 'PURCHASE_ORDER';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
