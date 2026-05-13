import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import balance from '@/routes/balance';
import { EventData, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UserTable } from './Table/UserTable';
import { userColumns } from './Table/UserColumns';
import { Separator } from '@/components/ui/separator';

type PageProps = {
    balances: {
        data: EventData[];
    };
    users: {
        data: User[];
    };
};
const startYear = 2023;
const endYear = new Date().getFullYear() + 1;

const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
);

const months = [
    {
        month: 1,
        name: 'January',
    },
    {
        month: 2,
        name: 'February',
    },
    {
        month: 3,
        name: 'March',
    },
    {
        month: 4,
        name: 'April',
    },
    {
        month: 5,
        name: 'May',
    },
    {
        month: 6,
        name: 'June',
    },
    {
        month: 7,
        name: 'July',
    },
    {
        month: 8,
        name: 'August',
    },
    {
        month: 9,
        name: 'September',
    },
    {
        month: 10,
        name: 'October',
    },
    {
        month: 11,
        name: 'November',
    },
    {
        month: 12,
        name: 'December',
    },
];

export default function BalanceIndex() {
    const { users } = usePage<PageProps>().props;

    console.log(users.data);

    return (
        <>
            <Head title="Balance" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="my-4 space-y-4">
                    {/* Search field here */}
                    <div className="flex max-w-4xl items-center gap-4">
                        <div className="flex-1">
                            <Label htmlFor="name" className="text-xs">
                                Name
                            </Label>

                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                placeholder="Search name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="month" className="text-xs">
                                Month
                            </Label>
                            <Select items={months}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        tabIndex={2}
                                        placeholder="Month"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {months.map((item) => (
                                            <SelectItem
                                                key={item.month}
                                                value={item.month}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="year" className="text-xs">
                                Year
                            </Label>
                            <Select items={years}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        tabIndex={3}
                                        placeholder="Year"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {years.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                {/* condition here */}

                {/* end condition */}
                {/* User List */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <h3 className="tex-sm font-semibold text-sky-600">
                            Employees
                        </h3>
                        <p className="text-xs">
                            {users.data.length}
                            {'  '}employees
                        </p>
                    </div>

                    <Separator />

                    {/* Data Table Hee */}
                    <UserTable data={users.data} columns={userColumns} />
                </div>
                {/* End User List */}
                {/* <div className="mt-24 flex flex-col items-center">
                    // <UserIcon size={64} className="text-sky-600" />
                    //{' '}
                    <h3 className="text-md font-medium">
                        // No selected user yet //{' '}
                    </h3>
                    // <p>Select an employee above to view their balance</p>
                    //{' '}
                </div> */}
            </div>
        </>
    );
}

BalanceIndex.layout = {
    breadcrumbs: [
        {
            title: 'Balance',
            href: balance.index(),
        },
    ],
};
