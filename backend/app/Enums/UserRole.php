<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'ADMIN';
    case APOTEKER = 'APOTEKER';
    case OWNER = 'OWNER';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}