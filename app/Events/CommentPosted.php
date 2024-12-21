<?php

namespace App\Events;

use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class CommentPosted implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $comment;

    /**
     * Buat event baru.
     *
     * @param  \App\Models\Comment  $comment
     * @return void
     */
    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
    }

    /**
     * Mendefinisikan channel yang akan digunakan untuk broadcasting.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('comments');
    }

    /**
     * Mendefinisikan data yang disiarkan.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'message' => 'user "'.$this->comment->user->name.'" has been comment.',
            'comment' => $this->comment,
            'type' => 'comment.posted'
        ];
    }
}
