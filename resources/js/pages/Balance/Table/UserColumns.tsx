import { Button } from '@/components/ui/button';
import balance from '@/routes/balance';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Sigma } from 'lucide-react';

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: () => (
            <div className="py-3 font-semibold text-sky-700">Name</div>
        ),
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className="flex items-center space-x-1.5">{user.name}</div>
            );
        },
    },
    {
        accessorKey: 'action',
        header: () => <div className="text-left">Action</div>,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center gap-2 text-xs">
                    <Link href={balance.show(data.id)}>
                        <Button className="rounded-md bg-sky-700 px-2 py-1.5 text-white hover:bg-sky-800">
                            <Sigma className="mr-2 h-4 w-4 text-white" />
                            View Balance
                        </Button>
                    </Link>
                </div>
            );
        },
    },
];
