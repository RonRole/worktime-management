export type Hours = number;
export type Minutes = number;

export function split(minutes: Minutes): [Hours, Minutes] {
    const hours = Math.floor(minutes / 60);
    const left_minutes = minutes % 60;
    return [hours, left_minutes];
}

export function toViewString(minutes: Minutes): string {
    const [hours, left_minutes] = split(minutes);
    const minutesView = ('00' + left_minutes).slice(-2);
    return `${hours}:${minutesView}`;
}

export type TimeProps = {
    hours?: number;
    minutes?: number;
};

export function totalMinutes({ hours = 0, minutes = 0 }: TimeProps = { hours: 0, minutes: 0 }): Minutes {
    return hours * 60 + minutes;
}
