<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'blog_id' => 'required|exists:blogs,id',
        ]);

        // Ambil user yang sedang login
        $user = User::find(Auth::user()->id);

        // Simpan koleksi blog
        $user->collections()->create([
            'blog_id' => $request->blog_id,
        ]);

        return redirect()->back();
    }

    public function index(): Response
    {
        // Ambil koleksi blog untuk pengguna yang sedang login
        $collections = User::find(Auth::user()->id)
            ->collections()
            ->with(['blog.writer', 'blog.category']) // Eager load relasi blog, writer, dan category
            ->paginate(10);

        // Kirim data koleksi ke komponen Inertia
        return Inertia::render('Blogs/Collections', [
            'collections' => $collections->map(function ($collection) {
                return [
                    'id' => $collection->blog->id,
                    'title' => $collection->blog->title,
                    'thumbnail_url' => $collection->blog->thumbnail_url,
                    'created_at' => $collection->blog->created_at,
                    'category' => [
                        'name' => $collection->blog->category->name ?? 'Uncategorized',
                    ],
                    'writer' => [
                        'name' => $collection->blog->writer->name ?? 'Unknown',
                    ],
                ];
            }),
        ]);
    }

    public function destroy($id)
    {
        // Ambil user yang sedang login
        $user = User::find(Auth::user()->id);

        // Hapus koleksi berdasarkan blog_id
        $collection = $user->collections()->where('blog_id', $id)->firstOrFail();
        $collection->delete();

        return redirect()->back();
    }
}
