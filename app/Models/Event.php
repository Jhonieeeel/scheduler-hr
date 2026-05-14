<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'user_id',
        'leave_type',
        'event_type',
        'time',
        'start',
        'end'
    ];

    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
        'time' => 'float'
    ];

    // relationship
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    // god model
    // public getUndertime($time) {
    //     return round($time / 480, 3);
    // }

    // public function checkEventType() {
    //     return match($leave_type) {
    //         'Undertime' => ''
    //     };
    // }
}
