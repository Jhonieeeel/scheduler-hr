<?php

namespace App\Http\Controllers;

use App\Data\EventData;
use App\Models\Event;
use App\Models\User;
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
    public function index()
    {
        $users = User::select(['id', 'name'])->get();

        return Inertia::render("Leave/LeaveIndex", ['users' => $users]);
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
        info($eventData->toArray());
        $eventData = Event::create($eventData->toArray());
        info($eventData);

        return to_route("leave.index")->with('message', 'Event Created Successfully!');
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
        //
    }
}
