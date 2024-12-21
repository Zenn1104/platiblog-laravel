<?php

namespace App\Events;

use App\Models\Blog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class NewBlogRequest implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Blog $blog;
    /**
     * Create a new event instance.
     */
    public function __construct(Blog $blog)
    {
        $this->blog = $blog;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel("blogs"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->blog->writer->name.'has been sending a request Blog "'.$this->blog->title.'".',
            'blog' => $this->blog,
            'type' => 'blog.created',
        ];
    }
}
