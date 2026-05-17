import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import balance from '@/routes/balance';
import { Head } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { User2Icon } from 'lucide-react';
import { useState } from 'react';
import { fetchUsers } from '../Hook/BalanceData';
import { userColumns } from './Table/UserColumns';
import { UserTable } from './Table/UserTable';

export default function BalanceIndex() {
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const debounceSearch = useDebounce(search, 500);

    const { data: users } = useQuery({
        queryKey: ['users', page, debounceSearch],
        queryFn: () => fetchUsers(page, search),
        staleTime: 3000,
    });

    return (
        <>
            <Head title="Balance" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="my-4 space-y-4">
                    {/* Search field here */}
                    <div className="flex max-w-sm items-center gap-4">
                        <div className="flex-1">
                            <Label htmlFor="name" className="text-xs">
                                Name
                            </Label>
                            <InputGroup className="max-w-xs">
                                <InputGroupInput
                                    tabIndex={1}
                                    required
                                    autoFocus
                                    value={search}
                                    autoComplete="name"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search name"
                                />
                                <InputGroupAddon>
                                    <User2Icon />
                                </InputGroupAddon>
                                <InputGroupAddon align="inline-end">
                                    {users?.data.length} result
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>
                </div>

                {/* User List */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-sky-600">
                            Employees
                        </h3>
                    </div>

                    <Separator />

                    {/* Data Table Hee */}
                    <UserTable
                        data={users?.data ?? []}
                        columns={userColumns}
                        pageData={users}
                        page={page}
                        setPage={setPage}
                    />
                </div>
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
