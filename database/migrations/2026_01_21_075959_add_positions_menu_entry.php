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
        $accessMenu = \App\Models\Menu::where('title', 'Access')->first();
        if ($accessMenu) {
            \App\Models\Menu::create([
                'title' => 'Positions',
                'icon' => 'Briefcase',
                'route' => '/positions',
                'order' => 5, // After Roles
                'permission_name' => 'roles-view', // Reuse roles-view or use a new one
                'parent_id' => $accessMenu->id,
            ]);
        }
    }

    public function down(): void
    {
        \App\Models\Menu::where('title', 'Positions')->where('route', '/positions')->delete();
    }
};
