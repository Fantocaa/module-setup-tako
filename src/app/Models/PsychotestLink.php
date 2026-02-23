<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsychotestLink extends Model
{
    protected $fillable = [
        'uuid',
        'applicant_name',
        'applicant_email',
        'nik',
        'expires_at',
        'used_at',
        'started_at',
        'finished_at',
        'results',
        'last_completed_session',
        'included_tests',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'results' => 'array',
        'included_tests' => 'array',
    ];

    public function getDurationAttribute()
    {
        if (!$this->started_at || !$this->finished_at) {
            return null;
        }

        return $this->started_at->diffForHumans($this->finished_at, true);
    }

    public function getDurationSecondsAttribute()
    {
        if (!$this->started_at || !$this->finished_at) {
            return 0;
        }

        return $this->started_at->diffInSeconds($this->finished_at);
    }

    const SESSION_DURATION_SECONDS = 60 * 10; // 30 seconds for testing, should be 1 * 60 for production

    public function isExpired()
    {
        // If the test is already finished, it's not "expired"
        if ($this->finished_at) {
            return false;
        }

        // Global link expiration (24h)
        if ($this->expires_at->isPast()) {
            return true;
        }

        return false;
    }

    public function isUsed()
    {
        return !is_null($this->used_at);
    }
}
