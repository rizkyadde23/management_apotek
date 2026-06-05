<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PreOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_id',
        'user_id',
        'customer_name',
        'customer_phone',
        'quantity',
        'status',
        'estimated_arrival_date',
        'notes'
    ];

    protected $casts = [
        'estimated_arrival_date' => 'date'
    ];

    public function medicine()
    {
        return $this->belongsTo(
            Medicine::class
        );
    }

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }
}