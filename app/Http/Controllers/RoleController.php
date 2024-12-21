<?php

namespace App\Http\Controllers;

use App\Events\NewWriterRequest;
use App\Http\Requests\WriterJoinRequest;
use App\Http\Requests\WriteUpdateProfileRequest;
use App\Models\User;
use App\Models\WriterRequest;
use App\Notifications\NewWriterRequestNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $request = WriterRequest::query()
                            ->with('user')
                            ->paginate(5);
        return response()->json([
            'data' => $request
        ]);
    }

    public function join(): Response
    {
        return Inertia::render('Users/JoinWriterForm');
    }

    public function join_writer_request(WriterJoinRequest $request): RedirectResponse
    {
        // Get validated data from request
        $data = $request->validated();

        // Find the authenticated user
        $user = User::find(Auth::id());

        // Initialize avatar file name and URL as null in case no file is uploaded
        $file_name = null;
        $file_url = null;

        // Handle avatar file upload if present
        if ($request->hasFile('avatar')) {
            $avatarInfo = $this->handleAvatarUpload($request->file('avatar'));
            $file_name = $avatarInfo['file_name'];
            $file_url = $avatarInfo['file_url'];
        }

        // Create a new writer request with the data
        $writer = WriterRequest::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'email' => $user->email,
            'phone' => $data['phone'],
            'birth' => $data['place_of_birth'] . ', ' . $data['date_of_birth'],
            'address' => $data['address'],
            'avatar' => $file_name,
            'avatar_url' => $file_url,
            'job' => $data['job'],
            'last_education' => $data['last_education'],
            'description' => $data['description'],
        ]);

        // Optionally, trigger any events if needed
        broadcast(new NewWriterRequest($writer));

        $admin= User::role("admin")->get();
        Notification::send($admin, new NewWriterRequestNotification($writer));

        // Redirect to the dashboard with a success message
        return redirect()->route('dashboard')->with('success', 'Request successfully sent.');
    }

    /**
     * Handle avatar file upload
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return array
     */
    private function handleAvatarUpload($file): array
    {
        // Get the file extension
        $extension = $file->getClientOriginalExtension();

        // Create a unique file name
        $file_name = 'avatar_' . md5(time() . $file->getClientOriginalName()) . '.' . $extension;

        // Store the file in the 'uploads' directory in public storage
        $file_path = $file->storeAs('uploads', $file_name, 'public');

        // Get the URL of the stored file
        $file_url = Storage::url($file_path);

        return [
            'file_name' => $file_name,
            'file_url' => $file_url,
        ];
    }

    public function approve_writer_request(int $writer_id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $request = WriterRequest::findOrFail($writer_id);

            $user = User::findOrFail($request->user_id);

            $updated = $user->update([
                'name' => $request->name,
                'birth' => $request->birth,
                'avatar' => $request->avatar,
                'avatar_url' => $request->avatar_url,
                'address' => $request->address,
                'job' => $request->job,
                'last_education' => $request->last_education,
                'description' => $request->description,
            ]);

            if (!$updated) {
                throw new \Exception('User update failed');
            }

            $user->syncRoles(['writer']);

            $request->writer_status = 'approve';
            $request->save();

            DB::commit();

            return redirect()->route('users.index')->with('success', 'Request berhasil disetujui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to approve writer request: ' . $e->getMessage());
            return redirect()->route('dashboard')->with('error', 'Gagal menyetujui request.');
        }
    }



    public function reject_writer_request(int $writer_id): RedirectResponse
    {
        $request = WriterRequest::find($writer_id);
        if(!$request) {
            return redirect()->route('users.index')->with('error', 'request is not found.');
        }

        $request->writer_status = 'rejected';
        $request->save();

        return redirect()->route('users.index')->with('success', 'success rejecting request.');
    }

    public function get_all_writer_request(?string $status = ''): Response
    {
        $data = WriterRequest::when($status, function($query) use ($status) {
            $query->where('writer_status', $status);
        })->get();

        return Inertia::render('Users/RequestWriter', [
            'requests' => $data,
        ]);
    }

    public function get_writer_request(int $writer_id): Response
    {
        $request = WriterRequest::find($writer_id);

        return Inertia::render('Users/ShowWriterRequest', [
            'request' => $request
        ]);
    }

    public function edit(int $request_id): Response
    {
        $request = WriterRequest::find($request_id);
        return Inertia::render('Users/EditWriterProfile', [
            'request' => $request,
        ]);
    }

    public function update(int $request_id, WriteUpdateProfileRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $profile = WriterRequest::find($request_id);

        if(!$profile) {
            return redirect()->route('dashboard')->with('error', 'profile not found!');
        }

        if(isset($data['name'])) {
            $profile->name = $data['name'];
        }

        if(isset($data['email'])) {
            $profile->email = $data['email'];
        }


        if(isset($data['phone'])) {
            $profile->phone = $data['phone'];
        }

        if(isset($data['address'])){
            $profile->address = $data['address'];
        }

        if(isset($data['place_of_birth']) || isset($data['date_of_birth'])){
            $profile->birth = $data['place_of_birth'].' ,'.$data['date_of_birth'];
        }

        if(isset($data['last_education'])) {
            $profile->last_education = $data['last_education'];
        }

        if(isset($data['job'])) {
            $profile->job = $data['job'];
        }

        if(isset($data['description'])) {
            $profile->description = $data['description'];
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $new_file = $request->file('avatar');
            $new_file_name = $profile->avatar;
            $file_path = $new_file->storeAs('uploads', $new_file_name, 'public');
            $profile->avatar = $new_file_name;
            $profile->avatar_url = $file_path;
        }

        $profile->save();

        return redirect()->route('dashboard')->with('success', 'update profile successfully');
    }

    public function promotedUser(User $user, string $role): RedirectResponse
    {
        $user->syncRoles([]);

        $user->assignRole($role);

        return redirect()->route('users.index')->with("user {$user->name} has successfully promoted with role {$role}");
    }

    public function profile_writer(int $id): Response
    {
        // Cari WriterRequest berdasarkan ID
        $writer = WriterRequest::with(['blogs' => function ($query) {
            $query->with(['writer', 'category']) // Load hubungan writer dan category
                ->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        // Dapatkan user saat ini
        $user = User::find(Auth::id());

        // Filter untuk role "reader"
        if ($user->hasRole('reader')) {
            $writer->blogs = $writer->blogs->filter(function ($blog) {
                return $blog->blog_status === 'approve';
            });
        }

        // Return data ke view Inertia
        return Inertia::render('Users/ProfileWriter', [
            'writer' => $writer,
        ]);
    }
}
