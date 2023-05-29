import React from 'react';

export type TargetMonthSelectProps = {
    defaultYYYYMM: string;
    optionYYYYMM: string[];
    desc?: boolean;
    onChange: (yyyyMM: string) => void;
} & Omit<React.ComponentProps<'div'>, 'onChange'>;

export default function TargetMonthSelect({
    defaultYYYYMM,
    optionYYYYMM,
    onChange,
    desc = false,
    ...props
}: TargetMonthSelectProps) {
    const onChangeWrapper = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const yyyyMM = e.currentTarget.value;
        onChange(yyyyMM);
    };
    return (
        <div {...props}>
            <label htmlFor='months' className='block text-xs'>
                Month
            </label>
            <select
                id='months'
                className='w-full border border-gray-300 focus:border-blue-300'
                onChange={onChangeWrapper}
                defaultValue={defaultYYYYMM}
            >
                {optionYYYYMM.map((yyyyMM) => (
                    <option key={yyyyMM} value={yyyyMM}>
                        {yyyyMM.slice(0, 4)}/{yyyyMM.slice(-2)}
                    </option>
                ))}
            </select>
        </div>
    );
}
