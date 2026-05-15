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
    public static function calculateBalance(Collection $currentEvents, Collection $previousEvents): Collection {

        $current = self::balances($currentEvents);
        $previous = self::balances($previousEvents);

       return $current->map(function ($currentBalance) use ($previous) {

            $previousBalance = $previous
                ->firstWhere('leave_type', $currentBalance['leave_type']);


            $previousRemaining = $previousBalance['remaining'] ?? 0;

            $remaining = match($previousBalance['leave_type']) {
                 'Vacation Leave' =>  $previousRemaining + $currentBalance['remaining'] + 1.25,
                 'Sick Leave' => $previousRemaining + $currentBalance['remaining'] + 1.25,
                 'Force Leave' => $previousRemaining + $currentBalance['remaining'],
                 'Special Privilege Leave' => $previousRemaining + $currentBalance['remaining'],
                 'Wellness Leave' => $previousRemaining + $currentBalance['remaining'],
            };

            info($currentBalance);
            // info($previousBalance);


            return [
                'leave_type' => $currentBalance['leave_type'],
                'current' => $currentBalance['remaining'] + $previousRemaining  ,
                'used' => $currentBalance['used'] + $previousBalance['used'],
                'remaining' => $remaining
            ];
        });


    }

    public static function balances(Collection $events): Collection
    {
        $leaveTypes = [
            'Vacation Leave',
            'Sick Leave',
            'Force Leave',
            'Wellness Leave',
            'Special Privilege Leave'
        ];

        $undertime = $events->where('leave_type', 'Undertime')
            ->where('event_type', 'filed')
            ->sum('time');

        $tardiness = $events->where('leave_type', 'Tardiness')
            ->where('event_type', 'filed')
            ->sum('time');


        $totalUndertime = round(($undertime + $tardiness) / 480, 3);
        info($totalUndertime);

        return collect($leaveTypes)->map(function ($type) use ($events, $totalUndertime) {

            $leaveType = $events->where('leave_type', $type);

            $allocated = $leaveType
                ->where('event_type', 'allocated')
                ->sum('time');

            $used = $leaveType
                ->where('event_type', 'filed')
                ->sum('time');

            $remaining = match ($type) {
                'Vacation Leave' =>
                    ($allocated - ($totalUndertime + $used)),

                'Sick Leave' =>
                    ($allocated - $used),

                'Force Leave' => $allocated - $used,

                'Wellness Leave' => $allocated - $used,


                default =>
                    $allocated - $used
            };

            return [
                'leave_type' => $type,
                'balance' => $allocated,
                'used' => $used,
                'remaining' => $remaining
            ];
        });
    }


}
