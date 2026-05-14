import leave from '@/routes/leave';
import { Head, usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User } from '@/types';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import { fetchEvents, months, years } from '../Hook/BalanceData';
import { DataTable } from '../Table/DataTable';
import EventForm from './Form/EventForm';
import { eventColumns } from './Table/EventColumns';
import { Button } from '@/components/ui/button';

type PageProps = {
    users: User[];
};

export default function LeaveIndex() {
    const { users } = usePage<PageProps>().props;

    const [page, setPage] = useState<number>(1);

    const [year, setYear] = useState<string>(
        new Date().getFullYear().toString(),
    );

    const [month, setMonth] = useState<string>(
        (new Date().getMonth() + 1).toString(),
    );

    const { data: events } = useQuery({
        queryKey: ['events', page, year, month],
        queryFn: () => fetchEvents(page, month, year),
        staleTime: 3000,
    });

    console.log(events);

    return (
        <>
            <Head title="File Event" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                    <div className="max-w-full space-y-4">
                        {/* Page title */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-sky-600">
                                File Event
                            </h3>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="rounded-md bg-sky-700 px-2 py-1.5 text-white hover:bg-sky-800">
                                            <Filter className="h-4 w-4" />
                                            Filter by
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-80 p-0"
                                        align="end"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between border-b px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Filter className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    Filter
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setMonth('');
                                                    setYear('');
                                                }}
                                                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                Clear all
                                            </button>
                                        </div>

                                        {/* Filters */}
                                        <div className="flex items-center justify-around p-4">
                                            {/* Month */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Month
                                                </label>
                                                <Select
                                                    value={month}
                                                    onValueChange={setMonth}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder="Select month" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {months.map((m, i) => (
                                                            <SelectItem
                                                                key={i}
                                                                value={m.month.toString()}
                                                            >
                                                                {m.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Year */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Year
                                                </label>
                                                <Select
                                                    value={year}
                                                    onValueChange={setYear}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder="Select year" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {years.map((y) => (
                                                            <SelectItem
                                                                key={y}
                                                                value={y.toString()}
                                                            >
                                                                {y}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex gap-2 border-t bg-muted/40 px-4 py-3">
                                            <Button
                                                variant="outline"
                                                className="h-8 flex-1 rounded-md bg-sky-700 px-2 py-1.5 text-sm text-white hover:bg-sky-800 hover:text-white"
                                                onClick={() => {
                                                    setMonth('');
                                                    setYear('');
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Form card */}
                        <EventForm users={users} />
                        {/* Table */}
                        {events?.data && (
                            <DataTable
                                key={events.data}
                                page={page}
                                setPage={setPage}
                                data={events?.data ?? []}
                                columns={eventColumns}
                                pageData={events?.data}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

LeaveIndex.layout = {
    breadcrumbs: [
        {
            title: 'Leave',
            href: leave.index(),
        },
    ],
};
