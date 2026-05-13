import { Eventdata } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const balanceColumns: ColumnDef<Eventdata>[] = [
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
        header: () => <div className="text-left">Start</div>,
        cell: ({ row }) => {
            const data = row.original.start;

            const formatted = format(new Date(data), 'MMM dd, yyyy');

            return (
                <div className="text-left text-xs font-medium">{formatted}</div>
            );
        },
    },
    {
        accessorKey: 'end',
        header: () => <div className="text-left">End</div>,
        cell: ({ row }) => {
            const data = row.original.end;

            const formatted = format(new Date(data), 'MMM dd, yyyy');

            return (
                <div className="text-left text-xs font-medium">{formatted}</div>
            );
        },
    },
];
