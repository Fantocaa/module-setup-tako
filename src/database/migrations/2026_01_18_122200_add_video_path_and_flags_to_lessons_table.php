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
        Schema::table('lessons', function (Blueprint $table) {
            $table->string('video_path')->nullable()->after('video_url');
            $table->boolean('is_published')->default(true)->after('order');
            $table->boolean('is_preview')->default(false)->after('is_published');
            $table->string('video_url')->nullable()->change(); // Ensure video_url is nullable
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['video_path', 'is_published', 'is_preview']);
        });
    }
};
