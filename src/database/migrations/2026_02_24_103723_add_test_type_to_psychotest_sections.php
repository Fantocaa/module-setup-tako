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
        Schema::table('psychotest_sections', function (Blueprint $table) {
            $table->string('test_type')->after('id')->nullable();
            
            // Drop old unique constraint if it exists
            // Since it was session_number + section_number
            $table->dropUnique(['session_number', 'section_number']);
            
            // New unique constraint
            $table->unique(['test_type', 'section_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('psychotest_sections', function (Blueprint $table) {
            $table->dropUnique(['test_type', 'section_number']);
            $table->dropColumn('test_type');
            $table->unique(['session_number', 'section_number']);
        });
    }
};
