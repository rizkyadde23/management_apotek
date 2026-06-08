<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expired_medicine_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained()->cascadeOnDelete();
            $table->enum('alert_type', ['CRITICAL', 'WARNING', 'INFO'])->default('INFO');
            $table->enum('status', ['PENDING', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'])->default('PENDING');
            $table->date('expiry_date');
            $table->integer('days_until_expiry')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index('medicine_id');
            $table->index('status');
            $table->index('alert_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expired_medicine_alerts');
    }
};
