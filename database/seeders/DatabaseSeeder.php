<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       $user = User::factory()->create([
            'name' => 'Ray Alingasa',
            'email' => 'test@example.com',
        ]);

        $events = [
            [
                'user_id' => $user->id,
                'leave_type' => "Vacation Leave",
                'event_type' => 'default',
                'time' => 5.584,
                'start' => '2023-01-01',
                'end' => '2023-01-01'
            ],
            [
                'user_id' => $user->id,
                'leave_type' => "Sick Leave",
                'event_type' => 'default',
                'time' => 10.792,
                'start' => '2023-01-01',
                'end' => '2023-01-01'
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }

    }
}
