<?php

namespace App\Models;

use App\Observers\WriterObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy([WriterObserver::class])]
class WriterRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
        'birth',
        'avatar',
        'avatar_url',
        'email',
        'phone',
        'address',
        'gender',
        'job',
        'last_education',
        'description'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class, 'writer_id', 'id');
    }
}
