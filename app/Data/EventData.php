<?php

namespace App\Data;

use App\Models\User;
use Spatie\LaravelData\Data;

class EventData extends Data {
    public function __construct(
        public ?int $id,
        public ?int $user_id,
        public ?string $leave_type,
        public ?string $event_type,
        public ?float $time,
        public ?string $start,
        public ?string $end,

        // user ( relationship )
        public ?User $user
    ) {}
}
