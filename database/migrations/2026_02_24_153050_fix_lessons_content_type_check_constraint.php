<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the check constraint created by the previous enum type in PostgreSQL
        DB::statement('ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_content_type_check');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to put it back exactly as it was if we want to retain 'pdf' support
    }
};
