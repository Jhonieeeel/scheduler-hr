import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
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
import balance from '@/routes/balance';
import { EventData, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { months, years } from '../Hook/BalanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BalanceTable } from './Table/BalanceTable';
import { balanceColumns } from './Table/BalanceColumns';

type PageProps = {
    balances: EventData;
    user: User;
    events: EventData[];
};

export default function UserBalance() {
    const { user, balances, events } = usePage<PageProps>().props;

    const [year, setYear] = useState<string>(
        new Date().getFullYear().toString(),
    );

    const [month, setMonth] = useState<string>(
        (new Date().getMonth() + 1).toString(),
    );

    console.log('Balances', balances);

    useEffect(() => {
        router.get(
            `/balance/${user.id}`,
            { month, year },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }, [month, year]);

    const date = new Date(Number(year), Number(month) - 1);

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className="relative min-h-screen flex-1 space-y-2.5 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                {/* user detail */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Viewing balance for
                        </p>
                        <h3 className="text-2xl font-bold text-sky-600">
                            {user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Date of{' '}
                            <span className="font-semibold text-sky-600">
                                {format(date, 'MMM yyyy')}
                            </span>
                        </p>
                    </div>
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
                <div className="grid grid-cols-5 gap-4">
                    {balances.map((data, index) => (
                        <Card className="mx-auto w-full max-w-sm">
                            <CardHeader>
                                <CardTitle>{data.leave_type}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Balance
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Used
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-sm font-medium">
                                        {data.remaining}
                                    </p>
                                    <p className="text-sm font-medium">
                                        {data.used}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div>
                    <BalanceTable data={events} columns={balanceColumns} />
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
