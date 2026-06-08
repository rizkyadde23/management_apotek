<?php

namespace App\Enums;

enum AuditLogAction: string
{
    case CREATE = 'CREATE';
    case READ = 'READ';
    case UPDATE = 'UPDATE';
    case DELETE = 'DELETE';
    case EXPORT = 'EXPORT';
    case LOGIN = 'LOGIN';
    case LOGOUT = 'LOGOUT';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
