<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Models\Position;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'position'])->latest()->paginate(10);
        $roles = Role::all();
        $positions = Position::all();

        return Inertia::render('users/Index', [
            'roles' => $roles,
            'positions' => $positions,
            'users' => $users,
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        $positions = Position::all();

        return Inertia::render('users/Form', [
            'roles' => $roles,
            'positions' => $positions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:6'],
            'role'        => ['required', Rule::exists('roles', 'name')],
            'position_id' => ['nullable', 'exists:positions,id'],
        ]);

        $user = User::create([
            'name'        => $validated['name'],
            'email'       => $validated['email'],
            'password'    => Hash::make($validated['password']),
            'position_id' => $validated['position_id'],
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $positions = Position::all();

        return Inertia::render('users/Form', [
            'user'         => $user->only(['id', 'name', 'email', 'position_id']),
            'roles'        => $roles,
            'positions'    => $positions,
            'currentRole'  => $user->roles->pluck('name')->first(), // satu role saja
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password'    => ['nullable', 'string', 'min:6'],
            'role'        => ['required', Rule::exists('roles', 'name')],
            'position_id' => ['nullable', 'exists:positions,id'],
        ]);

        $user->update([
            'name'        => $validated['name'],
            'email'       => $validated['email'],
            'password'    => $validated['password']
                ? Hash::make($validated['password'])
                : $user->password,
            'position_id' => $validated['position_id'],
        ]);

        $user->syncRoles([$validated['role']]);

        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword(User $user)
    {
        $user->update([
            'password' => Hash::make('ResetPasswordNya'),
        ]);

        return redirect()->back()->with('success', 'Password berhasil direset ke default.');
    }
}
