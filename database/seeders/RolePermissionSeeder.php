<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus cache permission yang ada
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Membuat permission dengan guard default (web)
        Permission::create(['name' => 'create blog', 'guard_name' => 'web']);
        Permission::create(['name' => 'read blog', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit blog', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete blog', 'guard_name' => 'web']);
        Permission::create(['name' => 'create user', 'guard_name' => 'web']);
        Permission::create(['name' => 'read user', 'guard_name' => 'web']);
        Permission::create(['name' => 'ban user', 'guard_name' => 'web']);
        Permission::create(['name' => 'unban user', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit profile', 'guard_name' => 'web']);
        Permission::create(['name' => 'create category', 'guard_name' => 'web']);
        Permission::create(['name' => 'read category', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit category', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete category', 'guard_name' => 'web']);
        Permission::create(['name' => 'approve request', 'guard_name' => 'web']);
        Permission::create(['name' => 'reject request', 'guard_name' => 'web']);
        Permission::create(['name' => 'read request', 'guard_name' => 'web']);

        // Hapus cache permission kembali
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Membuat role dan menetapkan permission dengan guard web
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo(Permission::all());

        $writerRole = Role::create(['name' => 'writer', 'guard_name' => 'web']);
        $writerRole->givePermissionTo('create blog');
        $writerRole->givePermissionTo('read blog');
        $writerRole->givePermissionTo('edit blog');
        $writerRole->givePermissionTo('delete blog');
        $writerRole->givePermissionTo('read category');

        $readerRole = Role::create(['name' => 'reader', 'guard_name' => 'web']);
        $readerRole->givePermissionTo('read blog');
        $readerRole->givePermissionTo('read category');
    }
}
