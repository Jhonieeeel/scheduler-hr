<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

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
    public static function calculateBalance(Collection $events): Collection {
        $leaveTypes = ['Vacation Leave', 'Sick Leave', 'Force Leave', 'Wellness Leave', 'Undertime', 'Special Privilege Leave'];

        return collect($leaveTypes)->map(function($type) use ($events) {

            $leave_type = $events->where('leave_type', $type);

            $currentBalance = $leave_type
                ->where('event_type', 'allocated')
                ->sum('time');

            $deductBalance = $leave_type
                ->where('event_type', 'filed')
                ->sum('time');

            $undertime = $leave_type
                ->where('event_type', 'filed')
                ->sum(function ($event) {
                    return Carbon::parse($event->start)
                        ->diffInMinutes(Carbon::parse($event->end));
                });

            $remaining = match($type) {
                'Vacation Leave' => ($currentBalance - ($undertime + $deductBalance)) + 1.25,
                'Sick Leave' => ($currentBalance - $deductBalance) + 1.25,
                'Undertime' => round($undertime / 480, 3),
                default => $currentBalance - $deductBalance
            };

            return [
                'leave_type' => $type,
                'balance' => $currentBalance,
                'used' => $deductBalance,
                'remaining' => $remaining
            ];

        });
    }
}
