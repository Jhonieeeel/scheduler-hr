import axios from 'axios';

const usersUrl = axios.create({
    url: 'http://localhost:8000',
});

export async function fetchUsers(page: number, search: string) {
    const res = await axios.get('/users', {
        params: { page, search },
    });
    return res.data;
}

export async function fetchEvents(page: number, month: string, year: string) {
    const res = await axios.get('/events', {
        params: { page, month, year },
    });

    return res.data;
}

const startYear = 2023;
const endYear = new Date().getFullYear() + 1;

export const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
);

export const months = [
    {
        month: 1,
        name: 'January',
    },
    {
        month: 2,
        name: 'February',
    },
    {
        month: 3,
        name: 'March',
    },
    {
        month: 4,
        name: 'April',
    },
    {
        month: 5,
        name: 'May',
    },
    {
        month: 6,
        name: 'June',
    },
    {
        month: 7,
        name: 'July',
    },
    {
        month: 8,
        name: 'August',
    },
    {
        month: 9,
        name: 'September',
    },
    {
        month: 10,
        name: 'October',
    },
    {
        month: 11,
        name: 'November',
    },
    {
        month: 12,
        name: 'December',
    },
];
