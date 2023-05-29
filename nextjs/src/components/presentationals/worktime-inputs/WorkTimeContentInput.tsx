export type WorkTimeContentInputProps = {
    onChange: (content?: string) => void;
    value?: string;
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'type' | 'value'>;

export default function WorkTimeContentInput({ onChange, value = '', ...props }: WorkTimeContentInputProps) {
    return (
        <input
            type='text'
            onChange={(e) => {
                e.preventDefault();
                onChange(e.currentTarget.value);
            }}
            value={value}
            {...props}
        />
    );
}
