<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $fillable = [
            'role_id',
            'name',
            'email',
            'password',
            'is_active'
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    public function role(){
        return $this->belongsTo(Role::class);
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

    public function transactions()
    {
        return $this->hasMany(
            Transaction::class
        );
    }
    
    public function notifications()
    {
        return $this->hasMany(
            Notification::class
        );
    }
}


