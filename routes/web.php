<?php

use App\Http\Controllers\BalanceController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');


    // json response
    Route::get("users", [BalanceController::class, 'users'])->name('users');
    Route::get("events", [EventController::class, 'events'])->name('events');

    // balance - event
    Route::get('balance', [BalanceController::class, 'index'])->name('balance.index');
    Route::get('balance/{user}', [BalanceController::class, 'show'])->name('balance.show');
    Route::post("balance", [BalanceController::class, 'store'])->name('balance.store');

    // leave - event
    Route::get('leave', [EventController::class, 'index'])->name('leave.index');
    Route::post('leave', [EventController::class, 'store'])->name('leave.store');
    Route::delete('leave', [EventController::class,'destroy'])->name('leave.destroy');
});

require __DIR__.'/settings.php';
