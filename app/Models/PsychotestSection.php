<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsychotestSection extends Model
{
    protected $fillable = [
        'test_type',
        'session_number',
        'section_number',
        'name',
        'duration',
    ];
}
