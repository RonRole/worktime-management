export type WorkTimeMinutesInputProps = {
    onChange(minute?: number): void;
    value?: number | '';
} & Omit<React.ComponentProps<'input'>, 'type' | 'min' | 'onChange' | 'value'>;

export default function WorkTimeMinutesInput({ onChange, value = '', ...props }: WorkTimeMinutesInputProps) {
    return (
        <input
            type='number'
            min='0'
            onChange={(e) => {
                e.preventDefault();
                const currentValue = e.currentTarget.value ? Number.parseInt(e.currentTarget.value) : undefined;
                onChange(currentValue);
            }}
            value={value}
            {...props}
        />
    );
}
