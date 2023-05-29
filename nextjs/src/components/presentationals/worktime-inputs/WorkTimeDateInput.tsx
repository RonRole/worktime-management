import React from 'react';

export type WorkTimeDateInputProps = {
    onChange(input?: string): void;
    value?: string;
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'type' | 'value'>;

export default function WorkTimeDateInputs({ onChange, value = '', ...props }: WorkTimeDateInputProps) {
    return (
        <input
            onChange={(e) => {
                e.preventDefault();
                onChange(e.currentTarget.value);
            }}
            value={value}
            type='date'
            {...props}
        />
    );
}
