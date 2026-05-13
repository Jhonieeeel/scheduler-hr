import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import balance from '@/routes/balance';
import { EventData, User } from '@/types';
import { usePage } from '@inertiajs/react';

type PageProps = {
    balances: EventData;
    user: User;
};

export default function UserBalance() {
    const { user, balances } = usePage<PageProps>().props;

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className="relative min-h-[100vh] flex-1 space-y-2.5 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                {/* user detail */}
                <div>
                    <p className="text-sm text-muted-foreground">
                        Viewing balance for
                    </p>
                    <h3 className="text-2xl font-bold text-sky-600">
                        {user.name}
                    </h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                                        {data.time}
                                    </p>
                                    <p className="text-sm font-medium">0</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
