<?php

namespace App\Http\Controllers;

use Algolia\AlgoliaSearch\SearchClient;
use App\Http\Requests\BlogCreateRequest;
use App\Http\Requests\BlogUpdateRequest;
use App\Models\Blog;
use App\Models\Category;
use App\Models\User;
use App\Models\WriterRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('title');
        $blog_status = $request->input('blog_status');
        $sortBy = $request->input('sort_by', 'title'); // Default sorting by title
        $sortOrder = $request->input('sort_order', 'asc'); // Default ascending order
        $user = User::where('id', Auth::id())->first();

        // Mulai query dengan eager loading
        $query = Blog::with(['writer', 'category']);

        // Apply common search filter
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        if($user->hasRole('admin')) {
             if ($blog_status && $blog_status !== 'all') {
                    $query->where('blog_status', $blog_status);
            }
        }

        if($user->hasRole('writer')) {
            $writer = WriterRequest::where('user_id', $user->id)->first();
            $query->where('writer_id', $writer->id);
                if ($blog_status && $blog_status !== 'all') {
                    $query->where('blog_status', $blog_status);
                }
        }

        if($user->hasRole('reader')) {
            $query->where('blog_status', 'approve');
        }

        // Apply sorting and pagination
        $blogs = $query->orderBy($sortBy, $sortOrder)
                    ->paginate(10)
                    ->appends($request->except('page')); // Maintain query parameters during pagination

        // Kembalikan data ke view
        return Inertia::render('Blogs/Index', [
            'blogs' => $blogs,
            'queryParams' => [
                'title' => $search,
                'blog_status' => $blog_status ?? 'all',
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
            'flash' => session()->get('success'),
        ]);
    }

    public function all(Request $request)
    {
        // Apply sorting and pagination
        $blogs = Blog::with(['writer', 'category'])
                    ->where('blog_status', 'approve')
                    ->orderBy('created_at', 'desc')
                    ->get();

        // Kembalikan data ke view
        return response()->json($blogs);
    }

    public function create(): Response
    {
        $categories = Category::all();
        return Inertia::render('Blogs/Create', ['categories' => $categories]);
    }

    public function store(BlogCreateRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Dapatkan writer berdasarkan user ID
        $writer = WriterRequest::where('user_id', Auth::id())->first();
        if (!$writer) {
            return redirect()->route('blogs.index')->with('error', 'Writer not found.');
        }

        // Inisialisasi variabel untuk thumbnail dan body
        $file_name = null;
        $file_url = null;

        // Upload dan simpan thumbnail jika ada file thumbnail
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $avatarInfo = $this->handleAvatarUpload($thumbnail);
            $file_name = $avatarInfo['file_name'];
            $file_url = $avatarInfo['file_url'];
        }

        // Gunakan transaksi untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Simpan blog baru ke database dengan konten HTML
             Blog::create([
                'title' => $data['title'],
                'writer_id' => $writer->id,
                'category_id' => $data['category'],
                'thumbnail' => $file_name,
                'thumbnail_url' => $file_url,
                'content' => $data['content'],
            ]);

            // Commit transaksi jika semuanya sukses
            DB::commit();

            return redirect()->route('blogs.index')->with('success', 'Blog created successfully.');
        } catch (\Exception $e) {
            // Rollback jika ada kesalahan
            DB::rollBack();

            return redirect()->route('blogs.index')->with('error', 'Failed to create blog. Error: ' . $e->getMessage());
        }
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
        $file_name = 'thumbnail_' . md5(time() . $file->getClientOriginalName()) . '.' . $extension;

        // Store the file in the 'uploads' directory in public storage
        $file_path = $file->storeAs('thumbnails', $file_name, 'public');

        // Get the URL of the stored file
        $file_url = Storage::url($file_path);

        return [
            'file_name' => $file_name,
            'file_url' => $file_url,
        ];
    }

    public function edit(Blog $blog): Response
    {
        $categories = Category::all();
        return Inertia::render('Blogs/Edit', [
            'categories' => $categories,
            'blog' => $blog,
        ]);
    }
    public function update(BlogUpdateRequest $request, Blog $blog): RedirectResponse
    {
        $data = $request->validated();

        // Get writer based on user ID
        $writer = WriterRequest::where('user_id', Auth::id())->first();
        if (!$writer) {
            return redirect()->route('blogs.index')->with('error', 'Writer not found.');
        }

        // Initialize variables for thumbnail
        $file_name = $blog->thumbnail;
        $file_url = $blog->thumbnail_url;

        // Update thumbnail if a new file is uploaded
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');

            // Delete the old thumbnail if it exists
            if ($blog->thumbnail) {
                Storage::disk('public')->delete('thumbnails/' . $blog->thumbnail);
            }

            // Handle the new thumbnail upload
            $avatarInfo = $this->handleAvatarUpload($thumbnail);
            $file_name = $avatarInfo['file_name'];
            $file_url = $avatarInfo['file_url'];
            $blog->thumbnail = $file_name;
            $blog->thumbnail_url = $file_url;
        }

        // Use a transaction to maintain data consistency
        DB::beginTransaction();

        try {
            if(isset($data['title']) && $data['title'] !== $blog->title) {
                $blog->title = $data['title'];
            }

            if(isset($data['category']) && $data['category'] !== $blog->category_id) {
                $blog->category_id = $data['category'];
            }

            if(isset($data['content']) && $data['content'] !== $blog->content) {
                $blog->content = $data['content'];
            }

            $blog->save();

            // Commit the transaction if successful
            DB::commit();

            return redirect()->route('blogs.show', $blog->id)->with('success', 'Blog updated successfully.');
        } catch (\Exception $e) {
            // Roll back if there is an error
            DB::rollBack();

            return redirect()->route('blogs.index')->with('error', 'Failed to update blog. Error: ' . $e->getMessage());
        }
    }

    public function destroy(Blog $blog): RedirectResponse
    {
        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully.');
    }

    public function approveBlog(Blog $blog): RedirectResponse
    {
        $blog->blog_status = "approve";
        $blog->save();

        return redirect()->route('blogs.index')->with('success', 'success approved blog');
    }

    public function rejectBlog(Blog $blog): RedirectResponse
    {
        $blog->blog_status = "rejected";
        $blog->save();

        return redirect()->route('blogs.index')->with('success', 'success rejected blog');
    }

    public function show($id): Response
    {
        $blog = Blog::with(['comments.user', 'comments.replies.user', 'category', 'writer', 'likes', 'collections'])
        ->findOrFail($id);

        $user = User::find(Auth::id());

        $is_saved = $user->collections()->where('blog_id', $blog->id)->exists();

        return Inertia::render('Blogs/Show', [
            'blog' => $blog,
            'is_saved' => $is_saved,
        ]);
    }

    public function search(string $query)
    {
        $blogs = Blog::search($query)->query(fn (Builder $query) => $query->with(['category', 'writer']))->get();

        return response()->json($blogs);
    }
}
