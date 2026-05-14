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
            $table->string('leave_type')->nullable(); // vl, sl, undertime( hours & minutes )
            $table->string('event_type')->nullable(); // accomodatd + , filed - , default ~
            $table->decimal('time')->nullable(); // 0.00
            $table->datetime('start')->nullable(); // 2026-05-14 08:00:00
            $table->datetime('end')->nullable(); //2026-05-14 09:30:00
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
