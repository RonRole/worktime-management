import React from 'react';

export type WorkTimeHoursInputProps = {
    onChange: (hours?: number) => void;
    value?: number | '';
} & Omit<React.ComponentProps<'input'>, 'type' | 'min' | 'onChange' | 'value'>;

export default function WorkTimeHoursInput({ onChange, value = '', ...props }: WorkTimeHoursInputProps) {
    return (
        <input
            type='number'
            min='0'
            onChange={(e) => {
                e.preventDefault();
                const currentValue = e.currentTarget.value ? Number(e.currentTarget.value) : undefined;
                onChange(currentValue);
            }}
            value={value}
            {...props}
        />
    );
}
