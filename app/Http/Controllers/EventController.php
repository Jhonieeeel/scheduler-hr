<?php

namespace App\Http\Controllers;

use App\Data\EventData;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{

    public function events() {
        $events = Event::query()->with('user:id,name')
            ->when(request('year'), function($query, $year) {
                $query->whereYear('start', $year); // request('year')
            })
            ->when(request('month'), function($query, $month) {
                $query->whereMonth('start', $month);
            })
            ->paginate(10);

        return response()->json(EventData::collect($events));
    }

    /**
     * Display a listing of the resource.
     */
    public function index(?Request $request)
    {
        $users = User::select(['id', 'name'])->get();

        return inertia('Leave/LeaveIndex', [
            'users'    => $users,
            'year'  => $request?->query('year', now()->year),
            'month' => $request?->query('month', now()->month),
        ]);
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
        // check if not UT or T then check the balance for LEAVE
        if ($eventData->leave_type !== "Undertime" && $eventData->leave_type !== "Tardiness") {
            Event::checkBalance($eventData);
        }

        // niya create
        Event::create($eventData->toArray());

        $date = Carbon::parse($eventData->start);

        return to_route('leave.index', [
            'year' => $date->year,
            'month' => $date->month
        ])->with('message', 'Event Created Successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();
        return to_route('leave.index', [
            'year' => Carbon::parse($event->start)->year,
            'month' => Carbon::parse($event->start)->month,
        ])->with('message', 'Event Deleted Successfully');
    }
}
