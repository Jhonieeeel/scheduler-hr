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
    public function store(EventData $eventData)
    {
        $start = Carbon::parse($eventData->start)
            ->addMonthNoOverflow()
            ->startOfMonth();

        $end = Carbon::parse($eventData->end)
            ->addMonthNoOverflow()
            ->startOfMonth();

        $types = ['Vacation Leave', 'Sick Leave'];

        foreach ($types as $type) {
            $exists = Event::where('user_id', $eventData->user_id)
                ->where('leave_type', $type)
                ->where('event_type', 'allocated')
                ->whereYear('start', $start->year)
                ->whereMonth('start', $start->month)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => "Accrual for {$start->format('F Y')} already exists.",
                ], 409);
            }

            Event::create([
                'user_id'    => $eventData->user_id,
                'leave_type' => $type,
                'event_type' => 'allocated',
                'time'       => 1.25,
                'start'      => $start,
                'end'        => $end,
            ]);
        }


        return to_route("balance.show", $eventData->user_id);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user) {

        $events = Event::where('user_id', $user->id)
            ->when(request('year'), function($query, $year) {
                $query->whereYear('start', request('year'));
            })
             ->when(request('month'), function($query, $month) {
                $query->whereMonth('start', request('month'));
            })
            ->orWhereYear('start', request('year'))
            ->get();

        $balances = Event::calculateBalance($events);

        return Inertia::render('Balance/UserBalance', [
            'user'     => $user->only('id', 'name'),
            'balances' => $balances,
            'events'   => EventData::collect($events),
        ]);
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
    public function destroy(string $id)
    {
        //
    }
}
