<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Update name if changed
        if (isset($data['name']) && $data['name'] !== $user->name) {
            $user->name = $data['name'];
        }

        // Update email if changed and reset email verification
        if (isset($data['email']) && $data['email'] !== $user->email) {
            $user->email = $data['email'];
            $user->email_verified_at = null; // Reset email verification
        }

        // Update birth details if place_of_birth or date_of_birth changed
        if (isset($data['place_of_birth']) && isset($data['date_of_birth']) &&
            ($data['place_of_birth'] !== $user->place_of_birth || $data['date_of_birth'] !== $user->date_of_birth)) {
            $user->birth = $data['place_of_birth']. ','. $data['date_of_birth'];
        }

        // Update address if changed
        if (isset($data['address']) && $data['address'] !== $user->address) {
            $user->address = $data['address'];
        }

        // Handle avatar upload if new file is uploaded
        if ($request->hasFile('avatar')) {
            // Delete the old avatar
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar_url);
            }

            // Store new avatar
            $file = $request->file('avatar');
            $extension = $file->getClientOriginalExtension();
            $file_name = 'avatar_' . md5(time() . $file->getClientOriginalName()) . '.' . $extension;

            // Save the file in the 'uploads' folder in public storage
            $file_path = $file->storeAs('uploads', $file_name, 'public');

            $user->avatar = $file_name;
            $user->avatar_url = Storage::url($file_path);
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }





    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
