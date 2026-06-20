<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NotificationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'low_stock_threshold',
        'expired_warning_days',
        'auto_notification',
    ];

    protected $casts = [
        'auto_notification' => 'boolean',
    ];
}