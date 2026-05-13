<?php

namespace App\Http\Controllers;

use App\Data\EventData;
use App\Models\Event;
use App\Models\User;
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
    public function store(Request $request)
    {
        //
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
            ->get();

        $leaveTypes = ['Vacation Leave', 'Sick Leave', 'Force Leave', 'Wellness Leave'];

        $balances = collect($leaveTypes)->map(function ($type) use ($events) {
            $filtered  = $events->where('leave_type', $type);
            $allocated = $filtered->where('event_type', 'allocated')->sum('time');
            $filed     = $filtered->where('event_type', 'filed')->sum('time');

            return [
                'leave_type' => $type,
                'balance'    => $allocated,
                'used'       => $filed,
                'remaining'  => $allocated - $filed,
            ];
        });

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
