<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Servis Laptop - Ganti SSD"
            $table->enum('category', ['Laptop', 'PC', 'Printer', 'AC', 'Smartphone', 'Elektronik Rumah Tangga']);
            $table->text('description')->nullable();
            $table->decimal('base_price', 12, 2)->default(0); // starting estimate, refined after diagnosis
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
