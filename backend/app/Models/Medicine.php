<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medicine extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'supplier_id',
        'category_id',
        'code',
        'batch_number',
        'name',
        'description',
        'type',
        'stock',
        'minimum_stock',
        'price',
        'expired_date',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'expired_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function supplier()
    {
        return $this->belongsTo(
            Supplier::class
        );
    }

    public function category()
    {
        return $this->belongsTo(
            MedicineCategory::class,
            'category_id'
        );
    }

    public function stockLogs()
    {
        return $this->hasMany(
            StockLog::class
        );
    }
    
    public function preOrders()
    {
        return $this->hasMany(
            PreOrder::class
        );
    }

    public function transactionDetails()
    {
        return $this->hasMany(
            TransactionDetail::class
        );
    }
}