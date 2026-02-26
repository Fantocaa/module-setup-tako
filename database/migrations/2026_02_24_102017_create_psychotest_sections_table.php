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
        Schema::create('psychotest_sections', function (Blueprint $table) {
            $table->id();
            $table->integer('session_number');
            $table->integer('section_number');
            $table->string('name')->nullable();
            $table->integer('duration')->default(600); // in seconds
            $table->timestamps();

            $table->unique(['session_number', 'section_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psychotest_sections');
    }
};
