<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Buat role admin dan user jika belum ada
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // Daftar permission berdasarkan menu structure
        $permissions = [
            'Dashboard' => [
                'dashboard-view',
            ],
            'Access' => [
                'access-view',
                'permission-view',
                'users-view',
                'roles-view',
                'positions-view',
            ],
            'Settings' => [
                'settings-view',
                'menu-view',
                // 'app-settings-view',
                'backup-view',
            ],
            'Utilities' => [
                'utilities-view',
                'log-view',
                // 'filemanager-view',
            ],
            'LMS' => [
                'lms-view',
                'course-view',
                'lesson-view',
                'tag-view',
            ],
        ];

        foreach ($permissions as $group => $perms) {
            foreach ($perms as $name) {
                // $permission = Permission::firstOrCreate([
                //     'name' => $name,
                //     'group' => $group,
                // ]);

                $permission = Permission::firstOrCreate(
                    [
                        'name'       => $name,
                        'guard_name' => 'web',
                    ],
                    [
                        'group'      => $group,
                    ]
                );

                // Assign ke admin
                if (!$admin->hasPermissionTo($permission)) {
                    $admin->givePermissionTo($permission);
                }
            }
        }
    }
}
