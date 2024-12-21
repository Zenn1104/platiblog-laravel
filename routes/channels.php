<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('blogs', function ($user) {
    //
});

Broadcast::channel('comments', function ($user) {
    //
});

Broadcast::channel('writer', function ($user) {
    //
});

