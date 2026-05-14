import { User } from './auth';

export type EventData = {
    user_id: number;
    leave_type: string;
    event_type: string;
    time: number;
    start: string;
    end: string;

    user?: User | undefined;
};

export type CurrentBalance = {
    leave_type: string;
    balance: number;
    used: number;
    remaining: number;
};

export type EventForm = {
    user_id: number | undefined;
    leave_type: string;
    event_type: string;
    time: number;
    start?: string;
    end?: string;
};
