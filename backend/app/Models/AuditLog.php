<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasFactory;

    protected $table = 'audit_logs';

    protected $fillable = [
        'user_id',
        'action',
        'module',
        'description',
        'old_value',
        'new_value',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'old_value' => 'array',
        'new_value' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }
}
