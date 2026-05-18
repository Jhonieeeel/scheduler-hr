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
import { EventForm, User } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';

import { differenceInMinutes, format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import leave from '@/routes/leave';
import { useQueryClient } from '@tanstack/react-query';

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
    { id: 6, leave_type: 'Wellness Leave' },
];

export default function form({
    users,
    form,
}: {
    users: User[];
    form: InertiaFormProps<EventForm>;
}) {
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);

    const [startTime, setStartTime] = useState<string>('08:00:00');
    const [endTime, setEndTme] = useState<string>('08:00:00');

    const [selectedUser, setSelectedUser] = useState<string>('');

    const queryClient = useQueryClient();

    function invalidateQuery() {
        queryClient.invalidateQueries({
            queryKey: ['events'],
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const start = form.data.start ? `${form.data.start} ${startTime}` : '';
        const end = form.data.end ? `${form.data.end} ${endTime}` : '';

        const isUndertime = form.data.leave_type === 'Undertime';
        const isTardiness = form.data.leave_type === 'Tardiness';

        const totalMinutes =
            isUndertime || isTardiness
                ? differenceInMinutes(new Date(end), new Date(start))
                : 1;

        form.setData({
            ...form.data,
            start: start,
            end: end,
            time: totalMinutes,
            event_type: 'filed',
        });

        form.submit(leave.store(), {
            onSuccess: () => {
                form.reset();
                setStartTime('08:00:00');
                setEndTme('08:00:00');
                setSelectedUser('');
                invalidateQuery();
            },
        });
    }

    const isFormIncomplete =
        !form.data.leave_type ||
        !form.data.start ||
        (form.data.leave_type === 'Undertime' &&
            (!form.data.start || !form.data.end));

    return (
        <div className="space-y-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    {/* Employee */}
                    <div className="space-y-1.5">
                        <Label htmlFor="employee">Employee</Label>
                        <Combobox
                            value={selectedUser}
                            items={users}
                            onValueChange={(val) => {
                                setSelectedUser(val);
                                const user = users.find((u) => u.name === val);
                                if (user) form.setData('user_id', user.id);
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
                        {form.errors.user_id && (
                            <p className="text-xs text-red-500">
                                {form.errors.user_id}
                            </p>
                        )}
                    </div>

                    {/* Leave type */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event_type">Event Type</Label>
                        <Combobox
                            items={event_types}
                            onValueChange={(val) =>
                                form.setData('leave_type', val)
                            }
                        >
                            <ComboboxInput
                                disabled={!form.data.user_id}
                                placeholder="Select an event"
                                className="border"
                            />
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
                        {form.errors.leave_type && (
                            <p className="text-xs text-red-500">
                                {form.errors.leave_type}
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
                                        disabled={!form.data.leave_type}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />

                                        {form.data.start &&
                                        isValid(
                                            parse(
                                                form.data.start,
                                                'yyyy-MM-dd',
                                                new Date(),
                                            ),
                                        )
                                            ? format(
                                                  parse(
                                                      form.data.start,
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
                                            form.data.start
                                                ? parse(
                                                      form.data.start,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        defaultMonth={
                                            form.data.start
                                                ? parse(
                                                      form.data.start,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            form.setData(
                                                'start',
                                                date
                                                    ? format(date, 'yyyy-MM-dd')
                                                    : '',
                                            );
                                            form.setData(
                                                'end',
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
                                disabled={!form.data.start}
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
                                        disabled={!form.data.start}
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />

                                        {form.data.end &&
                                        isValid(
                                            parse(
                                                form.data.end,
                                                'yyyy-MM-dd',
                                                new Date(),
                                            ),
                                        )
                                            ? format(
                                                  parse(
                                                      form.data.end,
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
                                            form.data.end
                                                ? parse(
                                                      form.data.end,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        defaultMonth={
                                            form.data.end
                                                ? parse(
                                                      form.data.end,
                                                      'yyyy-MM-dd',
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            form.setData(
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
                                disabled={!form.data.end}
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
                        onClick={() => form.reset()}
                        disabled={form.processing}
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        disabled={isFormIncomplete}
                        className="bg-sky-700 text-white hover:bg-sky-800"
                    >
                        {form.processing ?? <Spinner />}
                        File Event
                    </Button>
                </div>
            </form>
        </div>
    );
}
