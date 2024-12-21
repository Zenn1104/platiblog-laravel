<?php

namespace App\Observers;

use App\Events\BlogApproved;
use App\Events\BlogRejected;
use App\Events\NewBlogRequest;
use App\Models\Blog;
use App\Models\User;
use App\Notifications\BlogRequestNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class BlogObserver
{
    /**
     * Handle the Blog "created" event.
     */
    public function created(Blog $blog): void
    {
        $user = User::find(Auth::id());
        broadcast(new NewBlogRequest($blog));
        $admin = User::role("admin")->get();
        Notification::send($admin, new BlogRequestNotification($blog));
        $blog->searchable();
    }

    /**
     * Handle the Blog "updated" event.
     */
    public function updated(Blog $blog): void
    {
        if ($blog->isDirty('blog_status') && $blog->blog_status === 'approve') {
            broadcast( new BlogApproved($blog));
            $writer = User::role("writer")->get();
            $reader = User::role("reader")->get();
            $user_to_notify = $writer->merge($reader);
            Notification::send($user_to_notify, new BlogRequestNotification($blog));
            $blog->searchable();
        }

        if ($blog->isDirty('blog_status') && $blog->blog_status === 'rejected') {
            broadcast(new BlogRejected($blog));
            $writer = User::role("writer")->get();
            Notification::send($writer, new BlogRequestNotification($blog));
            $blog->searchable();
        }
        $blog->searchable();
    }

    /**
     * Handle the Blog "deleted" event.
     */
    public function deleted(Blog $blog): void
    {
        $blog->searchable();
    }

    /**
     * Handle the Blog "restored" event.
     */
    public function restored(Blog $blog): void
    {
        //
    }

    /**
     * Handle the Blog "force deleted" event.
     */
    public function forceDeleted(Blog $blog): void
    {
        //
    }
}
