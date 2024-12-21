<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NotificationCotroller extends Controller
{
    public function getNotifications(): JsonResponse
    {
        // Mendapatkan ID user yang sedang login
        $userId = Auth::id();

        // Query langsung ke database untuk mengambil notifikasi
        $notifications = DB::table('notifications')
            ->where('notifiable_id', $userId) // Filter berdasarkan ID user
            ->whereNull('read_at')           // Hanya mengambil notifikasi yang belum dibaca
            ->orderBy('created_at', 'desc')  // Urutkan berdasarkan waktu
            ->get();

        // Kirimkan data ke Inertia view
        return response()->json([
            'notifications' => $notifications,
        ]);
    }
}
