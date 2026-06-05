<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_code',
        'user_id',
        'subtotal',
        'discount',
        'total',
        'payment_status'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function details()
    {
        return $this->hasMany(
            TransactionDetail::class
        );
    }

    public function payment()
    {
        return $this->hasOne(
            Payment::class
        );
    }
}