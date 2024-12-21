<?php

namespace App\Models;

use App\Observers\BlogObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

#[ObservedBy([BlogObserver::class])]
class Blog extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'title',
        'thumbnail',
        'thumbnail_url',
        'content',
        'content_url',
        'writer_id',
        'category_id',
        'blog_status',
    ];

    public function writer(): BelongsTo
    {
        return $this->belongsTo(WriterRequest::class, 'writer_id', 'id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function collections(): HasMany
    {
        return $this->hasMany(Collection::class);
    }


    // Jumlah likes
    public function getLikesCountAttribute()
    {
        return $this->likes()->where('type', 'like')->count();
    }

    // Jumlah unlikes
    public function getUnlikesCountAttribute()
    {
        return $this->likes()->where('type', 'unlike')->count();
    }

      // Tentukan kolom-kolom yang ingin diindeks
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'thumbnail' => $this->thumbnail,
            'thumbnail_url' => $this->thumbnail_url,
            'content' => $this->content,
            'writer_id' => $this->writer_id,
            'category_id' => $this->category_id,
            'blog_status' => $this->blog_status,
        ];
    }
}
