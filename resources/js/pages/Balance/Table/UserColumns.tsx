import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import balance from '@/routes/balance';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ChartColumnBig } from 'lucide-react';

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: () => (
            <div className="py-3 text-xs font-semibold text-sky-700 uppercase dark:text-sky-400">
                Name
            </div>
        ),
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-2.5">
                    <UserInfo user={user} />
                </div>
            );
        },
    },
    {
        accessorKey: 'department',
        header: () => (
            <div className="py-3 text-xs font-semibold text-sky-700 uppercase dark:text-sky-400">
                Department
            </div>
        ),
        cell: () => (
            <Badge
                variant="secondary"
                className="bg-sky-100 text-sky-800 hover:bg-sky-100 dark:bg-sky-900 dark:text-sky-300 dark:hover:bg-sky-900"
            >
                AFMS
            </Badge>
        ),
    },
    {
        accessorKey: 'action',
        header: () => (
            <div className="py-3 text-xs font-semibold text-sky-700 uppercase dark:text-sky-400">
                Action
            </div>
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <Link href={balance.show(data.id)}>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 cursor-pointer border-sky-200 text-xs text-sky-700 hover:bg-sky-50 hover:text-sky-800 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-950 dark:hover:text-sky-300"
                    >
                        <ChartColumnBig className="mr-1.5 h-3.5 w-3.5" />
                        View balance
                    </Button>
                </Link>
            );
        },
    },
];
