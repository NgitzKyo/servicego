<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique(); // e.g. SG-20260621-0001
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('technician_id')->nullable()->constrained('technicians')->nullOnDelete();
            $table->foreignId('service_id')->constrained('services');
            $table->enum('order_type', ['home_service', 'pickup_dropoff']);
            $table->text('problem_description')->nullable();
            $table->string('address');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Order lifecycle status, mirrors SERVICE STATUS in the spec
            $table->enum('status', [
                'menunggu_teknisi',
                'diterima',
                'pengecekan',
                'menunggu_persetujuan',
                'perbaikan',
                'selesai',
                'dibatalkan',
            ])->default('menunggu_teknisi');

            $table->text('diagnosis_note')->nullable();
            $table->decimal('labor_cost', 12, 2)->default(0);
            $table->decimal('estimated_cost', 12, 2)->default(0); // labor + spareparts, pending approval
            $table->decimal('final_cost', 12, 2)->default(0);
            $table->boolean('is_approved_by_customer')->default(false);
            $table->timestamp('approved_at')->nullable();

            // Escrow payment simulation
            $table->enum('payment_status', [
                'belum_dibayar',
                'dana_ditahan',
                'selesai',
                'dana_diteruskan',
            ])->default('belum_dibayar');

            $table->boolean('is_warranty_order')->default(false); // true if generated from a warranty claim
            $table->foreignId('warranty_origin_id')->nullable(); // points to warranties.id if claim order

            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
