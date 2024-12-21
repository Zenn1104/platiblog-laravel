<?php

use App\Http\Controllers\{
    BlogController,
    CategoryController,
    CollectionController,
    CommentController,
    DashboardController,
    LikeController,
    NotificationCotroller,
    ProfileController,
    RoleController,
    UserController,
};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [DashboardController::class, 'welcome'])->name('welcome');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->group(function () {
    Route::resource('users', UserController::class)->only(['store', 'create']);
    Route::resource('categories', CategoryController::class)->except(['show', 'index']);
    Route::prefix('writer')->name('writer.')->group(function () {
        Route::get('/request', [RoleController::class, 'index'])->name('request');
        Route::post('/approve/{id}', [RoleController::class, 'approve_writer_request'])->name('approve');
        Route::post('/reject/{id}', [RoleController::class, 'reject_writer_request'])->name('reject');
    });
    Route::post('/users/ban/{id}', [UserController::class, 'ban_user'])->name('users.ban');
    Route::post('/users/unban/{id}', [UserController::class, 'unban_user'])->name('users.unban');
    Route::post('/blogs/approve/{blog}', [BlogController::class, 'approveBlog'])->name('blogs.approve');
    Route::post('/blogs/reject/{blog}', [BlogController::class, 'rejectBlog'])->name('blogs.reject');
    Route::post('/users/{user}/promoted/{role}', [RoleController::class, 'promotedUser'])->name('users.promoted');
});

// Writer routes
Route::middleware(['auth', 'verified', 'role:writer'])->prefix('blogs')->name('blogs.')->group(function () {
    Route::get('/create', [BlogController::class, 'create'])->name('create');
    Route::post('/', [BlogController::class, 'store'])->name('store');
    Route::get('/edit/{blog}', [BlogController::class, 'edit'])->name('edit');
    Route::put('/{blog}', [BlogController::class, 'update'])->name('update');
    Route::delete('/{blog}', [BlogController::class, 'destroy'])->name('destroy');
});

// Authenticated user routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/blogs/all', [BlogController::class, 'all'])->name('blogs.all');
    Route::resource('blogs', BlogController::class)->only(['index', 'show']);
    Route::get('/notifications', [NotificationCotroller::class, 'getNotifications'])->name('notifications');
    Route::resource('users', UserController::class)->only(['index']);
    Route::resource('categories', CategoryController::class)->only(['index', 'show']);
    Route::get('/search/{query}', [BlogController::class, 'search'])->name('blogs.search');
    Route::prefix('writer')->name('writer.')->group(function () {
        Route::post('/', [RoleController::class, 'join_writer_request'])->name('form');
        Route::get('/join', [RoleController::class, 'join'])->name('join');
    });
    Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
    Route::post('/collections', [CollectionController::class, 'store'])->name('collections.store');
    Route::get('/writers/{writer}', [RoleController::class, 'profile_writer'])->name('writer.profile');
    Route::post('blogs/{blog}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::get('blogs/{blog}/comments', [CommentController::class, 'index'])->name('comments.index');
    Route::post('/blogs/{blog}/like', [LikeController::class, 'like'])->name('blogs.like');
    Route::post('/blogs/{blog}/unlike', [LikeController::class, 'unlike'])->name('blogs.unlike');
    Route::get('/blogs/{blog}/count', [LikeController::class, 'count'])->name('likes.index');
    Route::delete('/collections/{blog}', [CollectionController::class, 'destroy'])->name('collections.destroy');
});

require __DIR__.'/auth.php';
