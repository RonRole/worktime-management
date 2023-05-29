import {
    endOfDay,
    endOfMonth,
    format,
    startOfDay,
    startOfMonth,
    parse,
    daysInWeek,
    differenceInCalendarDays,
    addDays,
    addMonths,
    differenceInMonths,
} from 'date-fns';
export * from 'date-fns';
export type PARAMETER_MONTH_FORMAT = 'yyyyMM';
export type DISPLAY_MONTH_FORMAT = 'yyyy/MM';
export type DISPLAY_DATE_FORMAT = 'yyyy/MM/dd';
export type INPUT_DATE_FORMAT = 'yyyy-MM-dd';

export type DATE_STRING_PATTERN =
    | PARAMETER_MONTH_FORMAT
    | DISPLAY_MONTH_FORMAT
    | DISPLAY_DATE_FORMAT
    | INPUT_DATE_FORMAT;

export { getDay } from 'date-fns';

export function isInvalidDate(date: Date) {
    return Number.isNaN(date.getTime())
}

export function monthList(fromYYYYMM: string, toYYYYMM: string): string[] {
    const from = parseDate(fromYYYYMM, 'yyyyMM');
    const to = parseDate(toYYYYMM, 'yyyyMM');
    if (isInvalidDate(from)) {
        throw Error(`fromYYYYMM:${fromYYYYMM} is invalid yyyyMM date format`)
    }
    if (isInvalidDate(to)) {
        throw Error(`toYYYYMM:${toYYYYMM} is invalid yyyyMM date format`)
    }
    if (from > to) {
        throw Error('from Date must be earlier than to Date');
    }
    const listSize = differenceInMonths(to, from) + 1;
    return [...Array(listSize)].map((_, index) => format(addMonths(from, index), 'yyyyMM'));
}

export function dateListOfMonth(yyyyMM: string): Date[] {
    const tempDate = parseDate(yyyyMM, 'yyyyMM');
    if (isInvalidDate(tempDate)) {
        throw Error(`${yyyyMM} is invalid yyyyMM date format`)
    }
    const listSize = differenceInCalendarDays(endOfMonth(tempDate), startOfMonth(tempDate)) + 1;
    return [...Array(listSize)].map((_, index) => addDays(tempDate, index));
}

const dayToJpn = {
    0: '日',
    1: '月',
    2: '火',
    3: '水',
    4: '木',
    5: '金',
    6: '土',
};

export function dayAsJpn(day: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
    return dayToJpn[day];
}

export function parseDate(dateString: string, parsePattern: DATE_STRING_PATTERN): Date {
    return parse(dateString, parsePattern, new Date());
}

export function formatDate(date: Date, formatPattern: DATE_STRING_PATTERN): string {
    return format(date, formatPattern);
}
