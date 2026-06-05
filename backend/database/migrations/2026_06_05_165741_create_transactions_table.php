<?php

use App\Enums\PaymentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {

            $table->id();

            $table->string('transaction_code')
                  ->unique();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->decimal('subtotal', 12, 2);

            $table->decimal('discount', 12, 2)
                  ->default(0);

            $table->decimal('total', 12, 2);

            $table->enum(
                'payment_status',
                PaymentStatus::values()
            )->default('UNPAID');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};