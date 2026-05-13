<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('leave_type')->nullable(); // vl, sl
            $table->string('event_type')->nullable(); // accomodatd + , filed - , default ~
            $table->decimal('time')->nullable(); // 0.00
            $table->date('start')->nullable(); // 2023-01-23
            $table->date('end')->nullable(); // 2023-01-23
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
