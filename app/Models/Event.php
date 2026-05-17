<?php

namespace App\Models;

use App\Data\EventData;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

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
    public static function checkFL(float $allocated, float $filed): void
    {
        if ($filed >= $allocated) {
            throw ValidationException::withMessages([
                'leave_type' => 'Not enough balance for Force Leave.',
            ]);
        }
    }

    public static function checkBalance(EventData $eventData): void {
        $events = self::where('user_id', $eventData->user_id)
            ->whereYear('start', $eventData->start)
            ->where('leave_type', $eventData->leave_type)
            ->get();

        if ($events->isEmpty()) {
            throw ValidationException::withMessages([
                'leave_type' => "No allocated balance found for {$eventData->leave_type} to this user.",
            ]);
        }

        $allocated = $events->where('event_type', 'allocated')->sum('time');

        if ($allocated === 0.0) {
            throw ValidationException::withMessages([
                'leave_type' => "No allocated balance found for {$eventData->leave_type}.",
            ]);
        }

        $filed = $events->where('event_type', 'filed')->sum('time');

        match($eventData->leave_type) {
            'Force Leave' => self::checkFL($allocated, $filed + $eventData->time),
            'Sick Leave' => '',
            'Vacation Leave' => '',
            'Wellness Leave' => '',
            default       => null,
        };
    }

    public static function calculateBalance(Collection $currentEvents, Collection $previousEvents): Collection {

        $current = self::balances($currentEvents);
        $previous = self::balances($previousEvents);

       return $current->map(function ($currentBalance) use ($previous) {

            $previousBalance = $previous
                ->firstWhere('leave_type', $currentBalance['leave_type']);

            $previousRemaining = $previousBalance['remaining'] ?? 0;

            $remaining = match($currentBalance['leave_type']) {
                'Vacation Leave'         => $previousRemaining + $currentBalance['remaining'] + 1.25,
                'Sick Leave'             => $previousRemaining + $currentBalance['remaining'] + 1.25,
                'Force Leave'            => $previousRemaining + $currentBalance['remaining'],
                'Special Privilege Leave'=> $previousRemaining + $currentBalance['remaining'],
                'Wellness Leave'         => $previousRemaining + $currentBalance['remaining'],
            };

            return [
                'leave_type' => $currentBalance['leave_type'],
                'current'    => $currentBalance['balance'] + $previousRemaining,
                'used'       => $currentBalance['used'] + ($previousBalance['used'] ?? 0),
                'remaining'  => $remaining
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


        $result = $undertime + $tardiness;

        $totalUndertime = round($result / 480, 3);


        return collect($leaveTypes)->map(function ($type) use ($events, $totalUndertime, $undertime) {

            $leaveType = $events->where('leave_type', $type);

            $allocated = $leaveType
                ->where('event_type', 'allocated')
                ->sum('time');

            $used = $leaveType
                ->where('event_type', 'filed')
                ->sum('time');

            $usedFL = $events->where('leave_type', 'Force Leave')->where('event_type', 'filed')->sum('time');


            $remaining = match ($type) {
                'Vacation Leave' => ($allocated - ($totalUndertime + ($used + $usedFL))),

                'Sick Leave' =>
                    (($allocated - $used)),

                'Force Leave' => $allocated - $used,

                'Wellness Leave' => $allocated - $used,

                default =>
                    $allocated - $used
            };

            return [
                'leave_type' => $type, // vl, sl and fl and so on
                'balance'    => $allocated, // current ni
                'used'       => $used, // na file
                'remaining'  => $remaining, // calculation sa current - filed
            ];
        });
    }



}
