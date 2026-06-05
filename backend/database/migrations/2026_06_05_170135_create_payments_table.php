<?php

use App\Enums\PaymentMethod;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {

            $table->id();

            $table->foreignId('transaction_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->enum(
                'payment_method',
                PaymentMethod::values()
            );

            $table->decimal('amount_paid', 12, 2);

            $table->decimal('change_amount', 12, 2)
                ->default(0);

            $table->timestamp('paid_at');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};