<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Position extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the courses that can be accessed by this position.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_position');
    }

    /**
     * Get the users that have this position.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
