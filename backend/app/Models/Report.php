<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Report extends Model
{
    use HasFactory;

    protected $table = 'reports';

    protected $fillable = [
        'user_id',
        'type',
        'filters',
        'format',
        'file_path',
        'generated_at'
    ];

    protected $casts = [
        'filters' => 'array',
        'generated_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }
}
