<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required','string','max:255'],
            'email' => ['required','string','lowercase','email','max:255','unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'place_of_birth' => ['string', 'max:50'],
            'date_of_birth' => ['string', 'max:50'],
            'avatar' => ['image', 'mimes:jpg,jpeg,png,webm', 'max:2048'],
            'address' => ['nullable', 'string', 'max:255'],

        ]);

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
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birth' => $request->place_of_birth. ','. $request->date_of_birth,
            'avatar' => $file_name,
            'avatar_url' => $file_url,
            'address' => $request->address,
        ]);
        $user->assignRole('reader');

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
