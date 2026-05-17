import leave from '@/routes/leave';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
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
import { EventForm as EventDataForm, User } from '@/types';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import { fetchEvents, months, years } from '../Hook/BalanceData';
import { DataTable } from '../Table/DataTable';
import EventForm from './Form/EventForm';
import { eventColumns } from './Table/EventColumns';

type PageProps = {
    users: User[];
    year?: string;
    month?: string;
};

export default function LeaveIndex() {
    const { users, year, month } = usePage<PageProps>().props;

    const form = useForm<EventDataForm>({
        user_id: 0,
        leave_type: '',
        event_type: '',
        time: 0,
        start: '',
        end: '',
    });

    const [page, setPage] = useState<number>(1);

    const [filterYear, setFilterYear] = useState<string>(
        year?.toString() ?? new Date().getFullYear().toString(),
    );
    const [filterMonth, setFilterMonth] = useState<string>(
        month?.toString() ?? (new Date().getMonth() + 1).toString(),
    );

    const { data: events } = useQuery({
        queryKey: ['events', page, filterYear, filterMonth],
        queryFn: () => fetchEvents(page, filterMonth, filterYear),
        staleTime: 1000 * 6,
    });

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
                            {/* Filter Button */}
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
                                                    setFilterMonth('');
                                                    setFilterYear('');
                                                }}
                                                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                Clear all
                                            </button>
                                        </div>

                                        {/* Filters */}
                                        <div
                                            key={events}
                                            className="flex items-center justify-around p-4"
                                        >
                                            {/* Month */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Month
                                                </label>
                                                <Select
                                                    value={filterMonth}
                                                    onValueChange={
                                                        setFilterMonth
                                                    }
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
                                                    value={filterYear}
                                                    onValueChange={
                                                        setFilterYear
                                                    }
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
                                                    setFilterMonth('');
                                                    setFilterYear('');
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
                        <EventForm form={form} users={users} />

                        {/* Table */}
                        <DataTable
                            data={events?.data ?? []}
                            columns={eventColumns}
                            pageData={events}
                            page={page}
                            setPage={setPage}
                        />
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
