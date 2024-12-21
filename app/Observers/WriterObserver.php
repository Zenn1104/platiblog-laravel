<?php

namespace App\Observers;

use App\Events\NewWriterRequest;
use App\Models\WriterRequest;

class WriterObserver
{
    /**
     * Handle the WriterRequest "created" event.
     */
    public function created(WriterRequest $writerRequest): void
    {
        broadcast(new NewWriterRequest($writerRequest));
    }

    /**
     * Handle the WriterRequest "updated" event.
     */
    public function updated(WriterRequest $writerRequest): void
    {
        //
    }

    /**
     * Handle the WriterRequest "deleted" event.
     */
    public function deleted(WriterRequest $writerRequest): void
    {
        //
    }

    /**
     * Handle the WriterRequest "restored" event.
     */
    public function restored(WriterRequest $writerRequest): void
    {
        //
    }

    /**
     * Handle the WriterRequest "force deleted" event.
     */
    public function forceDeleted(WriterRequest $writerRequest): void
    {
        //
    }
}
