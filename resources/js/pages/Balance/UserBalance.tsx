import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import balance from '@/routes/balance';
import leave from '@/routes/leave';
import { CurrentBalance, EventData, EventForm, User } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addMonths, format, parseISO } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';
import { fetchUserBalance, months, years } from '../Hook/BalanceData';
import { balanceColumns } from './Table/BalanceColumns';
import { BalanceTable } from './Table/BalanceTable';

type PageProps = {
    balances: CurrentBalance;
    user: User;
    events: EventData[];
    m: string;
    y: string;
};

export default function UserBalance() {
    const { user, balances, events, m, y } = usePage<PageProps>().props;

    const [year, setYear] = useState<string>(
        new Date().getFullYear().toString(),
    );
    const [month, setMonth] = useState<string>(
        (new Date().getMonth() + 1).toString(),
    );

    const eventForm = useForm<EventForm>({
        user_id: user.id,
        leave_type: '',
        event_type: 'allocated',
        time: 1.25,
        start: '',
        end: '',
    });

    const { data: userBalance, isLoading } = useQuery({
        queryKey: ['balance', user.id, month, year],
        queryFn: () => fetchUserBalance(user.id, month, year),
        initialData: { user, balances, events },
    });

    const queryClient = useQueryClient();

    function handleSubmit(e) {
        e.preventDefault();

        const newData = {
            ...eventForm.data,
            start: userBalance.events[0]?.start,
            end: userBalance.events[0]?.end,
        };

        eventForm.setData(newData);
        eventForm.submit(balance.store(), {
            onSuccess: () => {
                eventForm.reset();

                const date = parseISO(userBalance.events[0].start);
                const next = addMonths(date, 1);

                setMonth(format(next, 'M'));
                setYear(format(next, 'yyyy'));

                queryClient.invalidateQueries({
                    queryKey: ['balance', user.id],
                });
            },
        });
    }

    function renderAccrualButton() {
        if (!userBalance?.events?.length) return;

        if (userBalance?.events?.length > 0) {
            const date = parseISO(userBalance.events[0].start);
            const nextMonth = format(addMonths(date, 1), 'MMM');

            return (
                <Button
                    onClick={handleSubmit}
                    className="rounded-md border border-sky-700 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-700 hover:text-white dark:border-sky-600 dark:bg-sky-950 dark:text-sky-400 dark:hover:bg-sky-700 dark:hover:text-white"
                >
                    <Calendar />
                    Simulate {nextMonth} Accrual
                </Button>
            );
        }
        return;
    }

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className="relative min-h-screen flex-1 space-y-2.5 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                {/* User detail */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Viewing balance for
                        </p>
                        <h3 className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                            {user.name}
                        </h3>

                        {/* Month navigator */}
                        <div className="flex items-center gap-x-2">
                            <Button
                                size="xs"
                                disabled={Number(month) === 1}
                                onClick={() =>
                                    setMonth((prev) => String(Number(prev) - 1))
                                }
                                className="rounded-md border border-sky-700 bg-sky-50 px-3 py-1.5 pt-2 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-700 hover:text-white dark:border-sky-600 dark:bg-sky-950 dark:text-sky-400 dark:hover:bg-sky-700 dark:hover:text-white"
                            >
                                <ChevronLeft />
                            </Button>

                            <span className="min-w-30 text-center text-sm text-foreground">
                                {month && months[Number(month) - 1]?.name}{' '}
                                {year && year}
                            </span>

                            <Button
                                size="xs"
                                onClick={() => {
                                    setMonth((prev) =>
                                        String(
                                            Number(prev) === 12
                                                ? 1
                                                : Number(prev) + 1,
                                        ),
                                    );
                                    setYear((prev) =>
                                        String(
                                            Number(month) === 12
                                                ? Number(prev) + 1
                                                : prev,
                                        ),
                                    );
                                }}
                                className="rounded-md border border-sky-700 bg-sky-50 px-3 py-1.5 pt-2 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-700 hover:text-white dark:border-sky-600 dark:bg-sky-950 dark:text-sky-400 dark:hover:bg-sky-700 dark:hover:text-white"
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>

                    {/* Actions + Filter */}
                    <div className="flex items-center gap-3">
                        <p className="text-xs text-red-500 dark:text-red-400">
                            {eventForm.errors.accrual}
                        </p>

                        {renderAccrualButton()}

                        {userBalance.events.length > 1 && (
                            <div className="py-4">
                                <Link href={leave.index()}>
                                    <Button className="rounded-md border border-sky-700 bg-sky-50 px-3 py-1.5 pt-2 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-700 hover:text-white dark:border-sky-600 dark:bg-sky-950 dark:text-sky-400 dark:hover:bg-sky-700 dark:hover:text-white">
                                        <Calendar />
                                        Add Event
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Filter dropdown */}
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="rounded-md bg-sky-700 px-2 py-1.5 text-white hover:bg-sky-800 dark:bg-sky-800 dark:hover:bg-sky-700">
                                        <Filter className="h-4 w-4" />
                                        Filter by
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-80 p-0"
                                    align="end"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b px-4 py-3 dark:border-sky-900">
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
                                    <div className="flex gap-2 border-t bg-muted/40 px-4 py-3 dark:border-sky-900">
                                        <Button
                                            variant="outline"
                                            className="h-8 flex-1 rounded-md bg-sky-700 px-2 py-1.5 text-sm text-white hover:bg-sky-800 hover:text-white dark:bg-sky-800 dark:hover:bg-sky-700"
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
                </div>

                {/* Balance cards */}
                <div className="grid grid-cols-5 gap-4">
                    {userBalance?.balances?.map((data, index) => (
                        <Card
                            key={index}
                            className="mx-auto w-full max-w-sm border-sky-100 dark:border-sky-900"
                        >
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">
                                    {data.leave_type}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Balance
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Used
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Remaining
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-sm font-medium text-foreground">
                                        {data.current > 0.0
                                            ? data.current.toFixed(3)
                                            : 0}
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                        {data.used}
                                    </p>
                                    <Separator className="dark:bg-sky-900" />
                                    <p className="text-sm font-medium text-sky-700 dark:text-sky-400">
                                        {data.remaining > 0.0
                                            ? data.remaining.toFixed(3)
                                            : 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Events table */}
                <div>
                    <BalanceTable
                        isLoading={isLoading}
                        data={userBalance.events}
                        columns={balanceColumns}
                    />
                </div>
            </div>
        </div>
    );
}

UserBalance.layout = {
    breadcrumbs: [
        {
            title: 'Balance',
            href: balance.index(),
        },
    ],
};
