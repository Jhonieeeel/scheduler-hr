import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/types';
import { Form, useForm } from '@inertiajs/react';

import { differenceInMinutes, format, isValid, parse } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

import { EventForm as EventDataForm } from '@/types';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { events } from '@/routes';
import leave from '@/routes/leave';

type EventType = {
    id: number;
    leave_type: string;
};

const event_types: EventType[] = [
    { id: 1, leave_type: 'Vacation Leave' },
    { id: 2, leave_type: 'Sick Leave' },
    { id: 3, leave_type: 'Force Leave' },
    { id: 4, leave_type: 'Undertime' },
    { id: 5, leave_type: 'Tardiness' },
];

export default function EventForm({ users }: { users: User[] }) {
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);

    const [startTime, setStartTime] = useState<string>('00:00:00');
    const [endTime, setEndTme] = useState<string>('00:00:00');

    const eventForm = useForm<EventDataForm>({
        user_id: undefined,
        leave_type: '',
        event_type: '',
        time: 0,
        start: '',
        end: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const start = eventForm.data.start
            ? `${eventForm.data.start} ${startTime}`
            : '';
        const end = eventForm.data.end
            ? `${eventForm.data.end} ${endTime}`
            : '';

        const isUndertime = eventForm.data.leave_type === 'Undertime';
        const isTardiness = eventForm.data.leave_type === 'Tardiness';

        const totalMinutes =
            isUndertime || isTardiness
                ? Number(
                      Math.floor(
                          (differenceInMinutes(new Date(end), new Date(start)) /
                              480) *
                              1000,
                      ) / 1000,
                  )
                : -1;

        eventForm.setData({
            ...eventForm.data,
            start: start,
            end: end,
            time: totalMinutes,
            event_type: 'filed',
        });

        eventForm.submit(leave.store(), {
            onSuccess: () => {
                eventForm.reset();
                setStartTime('00:00:00');
                setEndTme('00:00:00');
            },
        });
    }

    return (
        <div className="space-y-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    {/* Employee */}
                    <div className="space-y-1.5">
                        <Label htmlFor="employee">Employee</Label>
                        <Combobox
                            items={users}
                            onValueChange={(val) => {
                                const user = users.find((u) => u.name === val);
                                if (user) eventForm.setData('user_id', user.id);
                            }}
                        >
                            <ComboboxInput placeholder="Select a user" />
                            <ComboboxContent>
                                <ComboboxEmpty>No users found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem
                                            key={item.id}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        {eventForm.errors.user_id && (
                            <p className="text-xs text-red-500">
                                {eventForm.errors.user_id}
                            </p>
                        )}
                    </div>

                    {/* Leave type */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event_type">Event Type</Label>
                        <Combobox
                            disabled={!eventForm.data.user_id}
                            items={event_types}
                            onValueChange={(val) =>
                                eventForm.setData('leave_type', val)
                            }
                        >
                            <ComboboxInput placeholder="Select an event" />
                            <ComboboxContent>
                                <ComboboxEmpty>No events found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem
                                            key={item.id}
                                            value={item.leave_type}
                                        >
                                            {item.leave_type}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        {eventForm.errors.event_type && (
                            <p className="text-xs text-red-500">
                                {eventForm.errors.event_type}
                            </p>
                        )}
                    </div>

                    {/* Start date */}
                    <FieldGroup className="max-w-xs flex-row">
                        <Field>
                            <FieldLabel htmlFor="date-picker-optional">
                                Start Date
                            </FieldLabel>
                            <Popover
                                open={startOpen}
                                onOpenChange={setStartOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        disabled={!eventForm.data.leave_type}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />

                                        {eventForm.data.start &&
                                        isValid(
                                            parse(
                                                eventForm.data.start,
                                                'yyyy-MM-dd',
                                                new Date(),
                                            ),
                                        )
                                            ? format(
                                                  parse(
                                                      eventForm.data.start,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  ),
                                                  'PPP',
                                              )
                                            : 'Select date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            eventForm.data.start
                                                ? parse(
                                                      eventForm.data.start,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        defaultMonth={
                                            eventForm.data.start
                                                ? parse(
                                                      eventForm.data.start,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            eventForm.setData(
                                                'start',
                                                date
                                                    ? format(date, 'yyyy-MM-dd')
                                                    : '',
                                            );
                                            setStartOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                        <Field className="w-32">
                            <FieldLabel htmlFor="time-picker-optional">
                                Time
                            </FieldLabel>
                            <Input
                                type="time"
                                id="time-picker-optional"
                                step="1"
                                disabled={!eventForm.data.start}
                                defaultValue={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                        </Field>
                    </FieldGroup>

                    {/* End date */}
                    <FieldGroup className="max-w-xs flex-row">
                        <Field>
                            <FieldLabel htmlFor="date-picker-optional">
                                End Date
                            </FieldLabel>
                            <Popover open={endOpen} onOpenChange={setEndOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        disabled={!eventForm.data.start}
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />

                                        {eventForm.data.end &&
                                        isValid(
                                            parse(
                                                eventForm.data.end,
                                                'yyyy-MM-dd',
                                                new Date(),
                                            ),
                                        )
                                            ? format(
                                                  parse(
                                                      eventForm.data.end,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  ),
                                                  'PPP',
                                              )
                                            : 'Select date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            eventForm.data.end
                                                ? parse(
                                                      eventForm.data.end,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        defaultMonth={
                                            eventForm.data.end
                                                ? parse(
                                                      eventForm.data.end,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            eventForm.setData(
                                                'end',
                                                date
                                                    ? format(date, 'yyyy-MM-dd')
                                                    : '',
                                            );
                                            setEndOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                        <Field className="w-32">
                            <FieldLabel htmlFor="time-picker-optional">
                                Time
                            </FieldLabel>
                            <Input
                                type="time"
                                id="time-picker-optional"
                                step="1"
                                disabled={!eventForm.data.end}
                                defaultValue={endTime}
                                onChange={(e) => setEndTme(e.target.value)}
                                className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                        </Field>
                    </FieldGroup>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => eventForm.reset()}
                        disabled={eventForm.processing}
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            eventForm.processing ||
                            (eventForm.data?.leave_type === 'Undertime' &&
                                (!eventForm.data?.start ||
                                    !eventForm.data?.end))
                        }
                        className="bg-sky-700 text-white hover:bg-sky-800"
                    >
                        {eventForm.processing ?? <Spinner />}
                        File Event
                    </Button>
                </div>
            </form>
        </div>
    );
}
