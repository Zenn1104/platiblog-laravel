<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function like(Blog $blog)
    {
        $user = Auth::user();

        // Periksa apakah user sudah unlike, hapus jika ada
        $existingUnlike = $blog->likes()->where('user_id', $user->id)->where('type', 'unlike')->first();
        if ($existingUnlike) {
            $existingUnlike->delete();
        }

        // Periksa apakah user sudah like, jika belum, tambahkan
        $existingLike = $blog->likes()->where('user_id', $user->id)->where('type', 'like')->first();
        if (!$existingLike) {
            $blog->likes()->create([
                'user_id' => $user->id,
                'type' => 'like',
            ]);
        }

        return redirect()->back();
    }

    public function unlike(Blog $blog)
    {
        $user = Auth::user();

        // Periksa apakah user sudah like, hapus jika ada
        $existingLike = $blog->likes()->where('user_id', $user->id)->where('type', 'like')->first();
        if ($existingLike) {
            $existingLike->delete();
        }

        // Periksa apakah user sudah unlike, jika belum, tambahkan
        $existingUnlike = $blog->likes()->where('user_id', $user->id)->where('type', 'unlike')->first();
        if (!$existingUnlike) {
            $blog->likes()->create([
                'user_id' => $user->id,
                'type' => 'unlike',
            ]);
        }

        return redirect()->back();
    }

    public function count(Blog $blog)
    {
        $user = Auth::user();

        return response()->json([
            'likes_count' => $blog->likes()->where('type', 'like')->count(),
            'unlikes_count' => $blog->likes()->where('type', 'unlike')->count(),
            'user_liked' => $user ? $blog->likes()->where('user_id', $user->id)->where('type', 'like')->exists() : false,
            'user_unliked' => $user ? $blog->likes()->where('user_id', $user->id)->where('type', 'unlike')->exists() : false,
        ]);
    }
}
