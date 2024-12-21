<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Events\CommentPosted;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CommentController extends Controller
{
    public function show(Blog $blog): Response
    {
        // Ambil komentar terkait blog dengan relasi (misalnya, komentar balasan)
        $comments = $blog->comments()->with('user', 'replies.user')->latest()->get();

        // Kembalikan tampilan show blog dengan komentar
        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'comments' => $comments,
            'auth' => Auth::user(),
        ]);
    }

    public function store(Request $request, Blog $blog)
    {
        // Validasi data komentar
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id', // ID komentar parent untuk reply
        ]);

        try {
            // Simpan komentar ke database
            $comment = $blog->comments()->create([
                'user_id' => Auth::id(),
                'content' => $validated['content'],
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            // Kirim respons sukses
            return redirect()->back();
        } catch (\Exception $e) {
            // Tangani kesalahan dan kirim respons error
            return response()->json([
                'message' => 'Failed to post comment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Menampilkan komentar berdasarkan blog
     *
     * @param Blog $blog
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Blog $blog)
    {
        $blog = Blog::with(['comments', 'category', 'writer'])->findOrFail($blog->id);
        // Ambil semua komentar terkait blog dengan relasi replies dan user
        $comments = $blog->comments()->whereNull('parent_id')->with('user', 'replies.user')->latest()->get();

        return response()->json($comments);
    }
}
