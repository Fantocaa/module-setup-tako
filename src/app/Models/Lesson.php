<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'content_type',
        'video_url',
        'video_path',
        'content',
        'duration',
        'order',
        'is_published',
        'is_preview',
    ];

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
    public function progress(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    /**
     * Get the progress for the current authenticated user.
     */
    public function currentUserProgress(): \Illuminate\Database\Eloquent\Relations\HasOne
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
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::saved(function ($lesson) {
            $lesson->course?->clearInstanceCache();
        });

        static::deleted(function ($lesson) {
            $lesson->course?->clearInstanceCache();
        });
    }
}
