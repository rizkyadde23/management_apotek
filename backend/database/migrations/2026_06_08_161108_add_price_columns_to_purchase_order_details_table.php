<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'purchase_order_details',
            function (Blueprint $table) {

                $table->decimal(
                    'unit_price',
                    12,
                    2
                )->default(0)
                 ->after('quantity');

                $table->decimal(
                    'subtotal',
                    12,
                    2
                )->default(0)
                 ->after('unit_price');
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'purchase_order_details',
            function (Blueprint $table) {

                $table->dropColumn([
                    'unit_price',
                    'subtotal'
                ]);
            }
        );
    }
};