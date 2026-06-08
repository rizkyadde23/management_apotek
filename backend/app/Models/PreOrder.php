<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreOrder extends Model
{
    protected $fillable = [

    'medicine_id',

    'purchase_order_id',

    'user_id',

    'customer_name',

    'customer_phone',

    'quantity',

    'status',

    'estimated_arrival_date',

    'notes'
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

    public function purchaseOrder()
{
    return $this->belongsTo(
        PurchaseOrder::class
    );
}
}