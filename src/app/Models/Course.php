<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Course extends Model
{
    protected $fillable = [
        'instructor_id',
        'title',
        'slug',
        'description',
        'thumbnail',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    protected $appends = [
        'lesson_count',
        'total_duration',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Retrieve the model for a bound value.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        if ($field) {
            return $this->where($field, $value)->firstOrFail();
        }

        if (is_numeric($value)) {
            return $this->where('id', $value)->orWhere('slug', $value)->firstOrFail();
        }

        return $this->where('slug', $value)->firstOrFail();
    }

    /**
     * Get the instructor that owns the course.
     */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the lessons for the course.
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    /**
     * Get the tags for the course.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'course_tag');
    }

    /**
     * Get the positions that have access to this course.
     */
    public function positions(): BelongsToMany
    {
        return $this->belongsToMany(Position::class, 'course_position');
    }

    /**
     * Get the lesson count attribute.
     */
    public function getLessonCountAttribute(): int
    {
        return $this->lessons()->count();
    }

    /**
     * Get the total duration attribute.
     */
    public function getTotalDurationAttribute(): int
    {
        return $this->lessons()->sum('duration') ?? 0;
    }

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::saving(function ($course) {
            if (empty($course->slug) || $course->isDirty('title')) {
                $course->slug = Str::slug($course->title);
            }
        });

        static::saved(fn ($course) => $course->clearInstanceCache());
        static::deleted(fn ($course) => $course->clearInstanceCache());
    }

    /**
     * Clear course related cache.
     */
    public static function clearCache(): void
    {
        Cache::tags(['courses'])->flush();
    }

    /**
     * Clear specific course cache.
     */
    public function clearInstanceCache(): void
    {
        Cache::forget("course:slug:{$this->slug}");
        static::clearCache();
    }
}
