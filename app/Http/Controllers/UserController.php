<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        // Ambil parameter pencarian, role, sorting, dan user saat ini
        $search = $request->input('name');
        $role = $request->input('role');
        $sortBy = $request->input('sort_by', 'name'); // Default sorting by name
        $sortOrder = $request->input('sort_order', 'asc'); // Default ascending order
        $user = User::find(Auth::id()); // User yang sedang login

        // Mulai query User dengan eager loading
        $query = User::with('roles');

        // Terapkan filter pencarian berdasarkan nama
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        // Filter berdasarkan role
        if ($user->hasRole('admin')) {
            // Admin dapat melihat semua user dan memfilter berdasarkan role
            if ($role && $role !== 'all') {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            }
        } elseif ($user->hasRole('reader') || $user->hasRole('writer')) {
            // Reader dan Writer hanya dapat melihat user dengan role writer
            $query->whereHas('roles', function ($q) {
                $q->where('name', 'writer');
            });
        }

        // Terapkan sorting dan pagination
        $users = $query->orderBy($sortBy, $sortOrder)
            ->paginate(10)
            ->appends($request->except('page')); // Simpan parameter selama pagination

        
        // Return data ke view menggunakan Inertia
        return Inertia::render('Users/Index', [
            'users' => $users,
            'queryParams' => [
                'name' => $search,
                'role' => $role ?? 'all',
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
            'flash' => session()->get('success'),
        ]);
    }





    public function create(): Response
    {
        return Inertia::render('Users/Create');
    }

    public function store(UserCreateRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            // Ambil ekstensi file asli
            $extension = $file->getClientOriginalExtension();

            // Buat nama file unik dengan hash dan tambahkan ekstensi
            $file_name = 'avatar_' . md5(time() . $file->getClientOriginalName()) . '.' . $extension;

            // Simpan file ke dalam folder 'uploads' di penyimpanan publik
            $file_path = $file->storeAs('uploads', $file_name, 'public');
            $file_url = Storage::url($file_path);
        }


        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'birth' => $data['place_of_birth']. ','. $data['date_of_birth'],
            'avatar' => $file_name,
            'avatar_url' => $file_url,
            'gender' => $data['gender'],
            'address' => $data['address'],
        ]);

        $user->assignRole($data['role']);

        return redirect(route('users.index', absolute: false))->with("success", "{$user->name} successfully created");
    }


    public function ban_user(int $user_id): RedirectResponse
    {
        $user = User::find($user_id);

        $user->is_ban = true;
        $user->save();

        return redirect()->route('users.index')->with('success', 'successfully ban user');
    }

    public function unban_user(int $user_id): RedirectResponse
    {
        $user = User::find($user_id);

        $user->is_ban = false;
        $user->save();

        return redirect()->route('users.index')->with('success', 'successfully to unban user.');
    }
}
