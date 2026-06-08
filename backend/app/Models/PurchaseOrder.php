<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [

        'po_number',

        'supplier_id',

        'created_by',

        'status'
    ];

    /*
    |--------------------------------------------------------------------------
    | Supplier
    |--------------------------------------------------------------------------
    */

    public function supplier()
    {
        return $this->belongsTo(
            Supplier::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Creator
    |--------------------------------------------------------------------------
    */

    public function creator()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Details
    |--------------------------------------------------------------------------
    */

    public function details()
    {
        return $this->hasMany(
            PurchaseOrderDetail::class
        );
    }

    public function preOrders()
{
    return $this->hasMany(
        PreOrder::class
    );
}
}