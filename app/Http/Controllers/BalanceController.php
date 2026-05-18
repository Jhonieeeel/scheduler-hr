<?php

namespace App\Http\Controllers;

use App\Data\EventData;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceController extends Controller
{

    public function users(Request $request) {
        $users = User::query()->select(['id','name'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10);

        return response()->json($users);

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $users = User::select(['id', 'name'])->paginate(10);

        return Inertia::render("Balance/BalanceIndex", []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EventData $eventData) {
        $start = Carbon::parse($eventData->start)
            ->addMonthNoOverflow()
            ->startOfMonth();

        $end = Carbon::parse($eventData->start)
            ->addMonthNoOverflow()
            ->endOfMonth();

        $types = ['Vacation Leave', 'Sick Leave'];

        foreach ($types as $type) {
            $exists = Event::where('user_id', $eventData->user_id)
                ->where('leave_type', $type)
                ->where('event_type', 'allocated')
                ->whereYear('start', $start->year)
                ->whereMonth('start', $start->month)
                ->exists();

            if ($exists) {
                return back()->withErrors(['accrual' => "Accrual for {$start->format('F Y')} already exists."]);
            }

            if ($start->month === 1) {
                $december = Carbon::parse($start)->subMonth();

                $decemberEvents = Event::where('user_id', $eventData->user_id)
                    ->whereYear('start', $december->year)
                    ->whereMonth('start', $december->month)
                    ->get();

                $previousEvents = Event::where('user_id', $eventData->user_id)
                    ->whereMonth('start', '<', $december->month)
                    ->whereYear('start', $december->year)
                    ->get();

                $balances = Event::calculateBalance($decemberEvents, $previousEvents);

                $other_leave_types = ['Vacation Leave', 'Sick Leave', 'Force Leave', 'Wellness Leave', 'Special Privilege Leave'];

                $decemberBalance = collect($balances)->firstWhere('leave_type', $type);

                $newBalance = match() {
                    'Vacation Leave' => $decemberBalance['remaining']
                }

                $time = $decemberBalance['remaining'] ?? 1.25;
            } else if ($type === "Force Leave" || ($type === "Wellness Leave") || ($type === "Special Privilege Leave")) {
                continue;
            }
            else {
                $time = 1.25;
            }

            Event::create([
                'user_id'    => $eventData->user_id,
                'leave_type' => $type,
                'event_type' => 'allocated',
                'time'       => $time,
                'start'      => $start,
                'end'        => $end,
            ]);
        }

        return to_route('balance.show', [
            'user' => $eventData->user_id,
            'm'    => $start->month,
            'y'    => $start->year,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user) {

        $currentEvents = Event::query()
            ->where('user_id', $user->id)
            ->whereYear('start', request('year'))
            ->whereMonth('start', request('month'))
            ->get();

        $previousEvents = Event::query()
            ->where('user_id', $user->id)
            ->when(request('month') && request('year'), function($query) {
                $query->whereMonth('start', '<', request('month'))
                ->whereYear('start', request('year'));
            })
            ->get();

        $balances = Event::calculateBalance($currentEvents, $previousEvents ?? []);

        $data = [
            'user'     => $user->only('id', 'name'),
            'balances' => $balances,
            'events'   => EventData::collect($currentEvents),
            'm' => request('m'),
            'y' => request('y')
        ];

        if (request()->wantsJson()) {
            return response()->json($data);
        }


        return Inertia::render('Balance/UserBalance', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventData $eventData)
    {
        Event::find($eventData->id)?->delete();

        $date = Carbon::parse($eventData->start);

        return to_route("balance.show", [
            'user' => $eventData->user_id,
            'month' => $date->month,
            'year' => $date->year,
        ]);
    }
}
