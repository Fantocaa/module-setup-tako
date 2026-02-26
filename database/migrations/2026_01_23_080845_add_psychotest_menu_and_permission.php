<?php

use App\Models\Menu;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create permission
        $permission = Permission::firstOrCreate(
            ['name' => 'psychotest-view', 'guard_name' => 'web'],
            ['group' => 'Utilities']
        );

        // 2. Assign to admin role
        $admin = Role::where('name', 'admin')->first();
        if ($admin && !$admin->hasPermissionTo($permission)) {
            $admin->givePermissionTo($permission);
        }

        // 3. Create Menu
        Menu::firstOrCreate(
            ['route' => '/psychotest'],
            [
                'title' => 'Psychotest Links',
                'icon' => 'Link',
                'order' => 10,
                'permission_name' => 'psychotest-view',
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Menu::where('route', '/psychotest')->delete();
        Permission::where('name', 'psychotest-view')->delete();
    }
};
