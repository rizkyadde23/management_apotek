<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExpiredMedicineAlert extends Model
{
    use HasFactory;

    protected $table = 'expired_medicine_alerts';

    protected $fillable = [
        'medicine_id',
        'alert_type',
        'status',
        'expiry_date',
        'days_until_expiry',
        'notes'
    ];

    protected $casts = [
        'expiry_date' => 'date'
    ];

    public function medicine()
    {
        return $this->belongsTo(
            Medicine::class
        );
    }
}
