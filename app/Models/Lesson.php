<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'content_type',
        'video_url',
        'video_path',
        'pdf_path',
        'content',
        'duration',
        'order',
        'is_published',
        'is_preview',
    ];

    protected $appends = ['slug'];

    protected $casts = [
        'content_type' => 'string',
        'duration' => 'integer',
        'order' => 'integer',
        'is_published' => 'boolean',
        'is_preview' => 'boolean',
    ];

    /**
     * Get the course that owns the lesson.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the progress records for the lesson.
     */
    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    /**
     * Get the progress for the current authenticated user.
     */
    public function currentUserProgress(): HasOne
    {
        return $this->hasOne(LessonProgress::class)->where('user_id', auth()->id());
    }

    /**
     * Scope a query to order lessons by order field.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order');
    }

    /**
     * Get the slug for the lesson title.
     */
    public function getSlugAttribute(): string
    {
        return Str::slug($this->title);
    }

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::deleting(function ($lesson) {
            if ($lesson->video_path && Storage::disk('public')->exists($lesson->video_path)) {
                Storage::disk('public')->delete($lesson->video_path);
            }
        });

        static::saved(function ($lesson) {
            $lesson->course?->clearInstanceCache();
        });

        static::deleted(function ($lesson) {
            $lesson->course?->clearInstanceCache();
        });
    }
}
