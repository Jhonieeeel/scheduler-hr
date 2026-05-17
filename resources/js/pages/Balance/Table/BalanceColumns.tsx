import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import balance from '@/routes/balance';
import { EventData, EventForm } from '@/types';
import { Button } from '@base-ui/react';
import { useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2Icon } from 'lucide-react';

export const balanceColumns: ColumnDef<EventData>[] = [
    {
        accessorKey: 'leave_type',
        header: () => <div className="text-left">Leave Type</div>,
        cell: ({ row }) => {
            const data = row.original;

            const leaveColor: Record<string, string> = {
                Default: 'bg-gray-600',
                'Vacation Leave': 'bg-sky-400',
                'Sick Leave': 'bg-pink-400',
                Undertime: 'bg-amber-500',
                Tardiness: 'bg-green-500',
                'Special Privilege Leave': 'bg-violet-400',
            };

            return (
                <div className="flex items-center gap-2 text-xs">
                    <span
                        className={`inline-block h-2 w-2 rounded-full ${leaveColor[data.leave_type]}`}
                    />
                    {data.leave_type}
                </div>
            );
        },
    },
    {
        accessorKey: 'event_type',
        header: () => <div className="text-left">Event</div>,
        cell: ({ row }) => {
            const event = row.original.event_type;

            type EventType = 'default' | 'filed' | 'allocated';

            const typeColor = {
                default: 'bg-sky-200 text-sky-600',
                filed: 'bg-red-200 text-red-600',
                allocated: 'bg-green-200 text-green-600',
            };

            return (
                <div className="capitaliz text-left text-xs font-medium">
                    <span
                        className={`rounded-full px-2 py-1 ${typeColor[event as EventType] ?? 'text-gray-600'}`}
                    >
                        {event}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'time',
        header: () => <div className="text-left">Time</div>,
        cell: ({ row }) => {
            const data = row.original;

            type EventType = 'default' | 'filed' | 'allocated';

            const timeColor: Record<EventType, string> = {
                default: 'text-sky-600',
                filed: 'text-red-600',
                allocated: 'text-green-600',
            };

            const timePrefix: Record<EventType, string> = {
                default: '~',
                filed: '-',
                allocated: '+',
            };

            const type = data.event_type as EventType;

            return (
                <div
                    className={`text-left text-xs font-medium ${timeColor[type] ?? 'text-gray-600'}`}
                >
                    {timePrefix[type]} {data.time.toFixed(2)}
                </div>
            );
        },
    },
    {
        accessorKey: 'start',
        header: () => <div className="text-left">Date</div>,
        cell: ({ row }) => {
            const { start, end } = row.original;

            const startDate = format(new Date(start), 'MMM dd');
            const endDate = format(new Date(end), 'MMM dd, yyyy');

            const isSameDay = start === end;

            return (
                <div className="text-left text-xs font-medium">
                    {isSameDay ? endDate : `${startDate} – ${endDate}`}
                </div>
            );
        },
    },
    {
        accessorKey: 'action',
        header: () => <div className="text-left">Action</div>,
        cell: ({ row }) => {
            const data = row.original;

            const form = useForm<EventForm>({
                id: data.id,
                user_id: data.user_id,
            });

            function handleDelete() {
                form.submit(balance.destroy(Number(form.data.id)));
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-red-600"
                        >
                            <Trash2Icon className="text-red-600 hover:text-red-600" />
                            <span className="text-red-600 hover:text-red-600">
                                Delete
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
