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
        Schema::create('psychotest_questions', function (Blueprint $table) {
            $table->id();
            $table->string('test_type'); // papicostic, cfit, disc
            $table->integer('session_number')->default(1);
            $table->integer('section_number')->nullable();
            $table->integer('question_number');
            $table->string('type'); // forced, standard, disc, multiple_select, comparison
            $table->json('content')->nullable(); // text, images, items
            $table->json('options')->nullable(); // choices
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psychotest_questions');
    }
};
