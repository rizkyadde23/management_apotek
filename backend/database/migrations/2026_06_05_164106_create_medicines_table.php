<?php

use App\Enums\MedicineType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {

            $table->id();

            $table->foreignId('supplier_id')
                ->constrained()
                ->cascadeOnUpdate();

            $table->foreignId('category_id')
                ->constrained('medicine_categories')
                ->cascadeOnUpdate();

            $table->string('code')->unique();

            $table->string('batch_number');

            $table->string('name');

            $table->text('description')
                ->nullable();

            $table->enum('type', MedicineType::values());

            $table->integer('stock')
                ->default(0);

            $table->integer('minimum_stock')
                ->default(10);

            $table->decimal('price', 12, 2);

            $table->date('expired_date');

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();

            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};