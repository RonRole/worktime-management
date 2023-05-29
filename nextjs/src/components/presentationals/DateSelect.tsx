import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';

export type DateSelectProps = {
    year: number;
    month: number;
    onClickDate?(date: number): void;
};

export default function DateSelect({ year, month, onClickDate = () => {} }: DateSelectProps) {
    const tempDate = new Date(year, month);
    const start = startOfMonth(tempDate);
    const end = endOfMonth(tempDate);
    const size = end.getDate() - start.getDate() + 1;
    return (
        <div className='flex'>
            {[...Array(size)].map((_, index) => (
                <a href='#' onClick={()=>onClickDate(index+1)} className='flex-1' key={index}>
                    {index + 1}
                </a>
            ))}
        </div>
    );
}
