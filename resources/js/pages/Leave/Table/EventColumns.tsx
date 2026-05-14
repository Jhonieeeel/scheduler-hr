import { Eventdata } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { differenceInMinutes, format } from 'date-fns';

export const eventColumns: ColumnDef<Eventdata>[] = [
    {
        accessorKey: 'user.name',
        header: () => <div className="text-left">Employee Name</div>,
        cell: ({ row }) => {
            const data = row.original.user.name;

            return (
                <div className="flex items-center gap-2 text-xs">
                    <span className="inline-block h-2 w-2 rounded-full" />
                    {data}
                </div>
            );
        },
    },
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

            const startDate = new Date(data.start);
            const endDate = new Date(data.end);

            let totalMinutes = 0;
            let min = 0;

            if (data.leave_type === 'Undertime') {
                min = differenceInMinutes(endDate, startDate);

                totalMinutes = Math.floor((min / 480) * 1000) / 1000;
            }

            const type = data.event_type as EventType;

            return (
                <div
                    className={`text-left text-xs font-medium ${timeColor[type] ?? 'text-gray-600'}`}
                >
                    {data.leave_type === 'Undertime'
                        ? `${timePrefix[type]} ${totalMinutes}`
                        : `${timePrefix[type]} ${data.time.toFixed(2)}`}
                </div>
            );
        },
    },
    {
        accessorKey: 'start',
        header: () => <div className="text-left">Start</div>,
        cell: ({ row }) => {
            const data = row.original;

            let date = format(new Date(data.start), 'yyyy-MM-dd');
            let timeOnly = format(new Date(data.start), 'HH:mm');

            const formatted =
                data.leave_type === 'Undertime'
                    ? `${date} - ${timeOnly}`
                    : `${date}`;

            return (
                <div className="text-left text-xs font-medium">{formatted}</div>
            );
        },
    },
    {
        accessorKey: 'end',
        header: () => <div className="text-left">End</div>,
        cell: ({ row }) => {
            const data = row.original;

            let date = format(new Date(data.end), 'yyyy-MM-dd');
            let timeOnly = format(new Date(data.end), 'HH:mm');

            const formatted =
                data.leave_type === 'Undertime'
                    ? `${date} - ${timeOnly}`
                    : `${date}`;

            return (
                <div className="text-left text-xs font-medium">{formatted}</div>
            );
        },
    },
];
