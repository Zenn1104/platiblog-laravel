<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Category;
use App\Models\User;
use App\Models\WriterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('title');
        $blog_status = $request->input('blog_status');
        $user = User::find(Auth::id());

        // Mulai query dengan eager loading
        $query = Blog::with(['writer', 'category']);

        // Filter berdasarkan judul
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        // Statistik awal dengan nilai default
        $statistics = [
            'approvedBlogs' => 0,
            'rejectedBlogs' => 0,
            'pendingBlogs' => 0,
            'totalBlogs' => 0,
            'totalUsers' => 0,
            'totalWriterRequest' => 0,
            'approvedPercentage' => 0,
            'rejectedPercentage' => 0,
            'pendingPercentage' => 0,
            'totalBlogsPercentage' => 0, // Pertumbuhan total blog
            'totalUsersPercentage' => 0, // Pertumbuhan total pengguna
            'totalWriterRequestPercentage' => 0, // Pertumbuhan permintaan penulis
        ];

        // Statistik untuk admin
        if ($user->hasRole('admin')) {
            // Jika ada filter status blog, terapkan pada query
            if ($blog_status && $blog_status !== 'all') {
                $query->where('blog_status', $blog_status);
            }

            // Hitung statistik saat ini
            $statistics['approvedBlogs'] = Blog::where('blog_status', 'approve')->count();
            $statistics['rejectedBlogs'] = Blog::where('blog_status', 'reject')->count();
            $statistics['pendingBlogs'] = Blog::where('blog_status', 'pending')->count();
            $statistics['totalBlogs'] = Blog::count();
            $statistics['totalUsers'] = User::count();
            $statistics['totalWriterRequest'] = WriterRequest::where('writer_status', 'pending')->count();

            // Hitung statistik periode sebelumnya (misalnya, bulan lalu)
            $previousMonth = now()->subMonth();
            $currentMonth = now();

            // Total Blogs
            $previousTotalBlogs = Blog::whereBetween('created_at', [
                $previousMonth->copy()->startOfMonth(),
                $previousMonth->copy()->endOfMonth()
            ])->count();
            $currentTotalBlogs = $statistics['totalBlogs'];
            $statistics['totalBlogsPercentage'] = $previousTotalBlogs > 0
                ? round((($currentTotalBlogs - $previousTotalBlogs) / $previousTotalBlogs) * 100, 2)
                : 0;

            // Total Users
            $previousTotalUsers = User::whereBetween('created_at', [
                $previousMonth->copy()->startOfMonth(),
                $previousMonth->copy()->endOfMonth()
            ])->count();
            $currentTotalUsers = $statistics['totalUsers'];
            $statistics['totalUsersPercentage'] = $previousTotalUsers > 0
            ? round((($currentTotalUsers - $previousTotalUsers) / $previousTotalUsers) * 100, 2)
            : ($currentTotalUsers > 0 ? 100 : 0);


            // Total Writer Requests
            $previousWriterRequests = WriterRequest::whereBetween('created_at', [
                $previousMonth->copy()->startOfMonth(),
                $previousMonth->copy()->endOfMonth()
            ])
            ->where('writer_status', 'pending')
            ->count();
            $currentWriterRequests = $statistics['totalWriterRequest'];
            $statistics['totalWriterRequestPercentage'] = $previousWriterRequests > 0
            ? round((($currentWriterRequests - $previousWriterRequests) / $previousWriterRequests) * 100, 2)
            : ($currentWriterRequests > 0 ? 100 : 0);

        }

        // Statistik untuk writer
        if ($user->hasRole('writer')) {
            $writer = WriterRequest::where('user_id', $user->id)->first();

            if ($writer) {
                $query->where('writer_id', $writer->id);

                // Hitung statistik untuk writer
                $statistics['approvedBlogs'] = Blog::where('writer_id', $writer->id)
                    ->where('blog_status', 'approve')->count();
                $statistics['rejectedBlogs'] = Blog::where('writer_id', $writer->id)
                    ->where('blog_status', 'reject')->count();
                $statistics['pendingBlogs'] = Blog::where('writer_id', $writer->id)
                    ->where('blog_status', 'pending')->count();
                $statistics['totalBlogs'] = Blog::where('writer_id', $writer->id)->count();
            }

            // Terapkan filter status blog jika diperlukan
            if ($blog_status && $blog_status !== 'all') {
                $query->where('blog_status', $blog_status);
            }
        }

        // Filter untuk reader
        if ($user->hasRole('reader')) {
            $query->where('blog_status', 'approve');
        }

        // Hitung persentase berdasarkan totalBlogs
        $totalBlogs = $statistics['totalBlogs'] ?: 1; // Hindari pembagian dengan nol
        $statistics['approvedPercentage'] = round(($statistics['approvedBlogs'] / $totalBlogs) * 100, 2);
        $statistics['rejectedPercentage'] = round(($statistics['rejectedBlogs'] / $totalBlogs) * 100, 2);
        $statistics['pendingPercentage'] = round(($statistics['pendingBlogs'] / $totalBlogs) * 100, 2);

        // Ambil data blog
        $blogs = $query->orderBy('created_at', 'desc')
            ->paginate(8)
            ->appends($request->except('page')); // Maintain query parameters during pagination

        // Kembalikan data ke view
        return Inertia::render('Dashboard', [
            'blogs' => $blogs,
            'queryParams' => [
                'title' => $search,
                'blog_status' => $blog_status ?? 'all',
            ],
            'statistics' => $statistics, 
            'flash' => session()->get('success'),
        ]);
    }

    public function welcome(Request $request): Response
    {
        $query = Blog::with(['writer', 'category']);

        // Ambil data blog
        $blogs = $query->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // Kembalikan data ke view
        return Inertia::render('Welcome', [
            'blogs' => $blogs,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
