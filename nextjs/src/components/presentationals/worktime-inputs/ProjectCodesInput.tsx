import ProjectCode from '@/domains/project-code';
import React from 'react';
import { ProjectCodeMap } from '../../inputs/inputs';

export type ProjectCodesInputProps = {
    projectCodeMap: ProjectCodeMap;
    onChange?: (currentInput: string) => void;
    value?: string;
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'list'>;

export default function ProjectCodesInput({
    projectCodeMap,
    onChange = () => {},
    value = '',
    ...props
}: ProjectCodesInputProps) {
    const [isValid, setIsValid] = React.useState<boolean>(!!projectCodeMap[value]);
    const [currentCode, setCurrentCode] = React.useState<ProjectCode | undefined>(projectCodeMap[value]);
    const onChangeWrapper = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const newCodeId = e.currentTarget.value;
            setIsValid(!!projectCodeMap[newCodeId]);
            setCurrentCode(projectCodeMap[newCodeId]);
            onChange(e.currentTarget.value);
        },
        [onChange, projectCodeMap],
    );
    return (
        <>
            <input type='text' list='project-codes' onChange={onChangeWrapper} value={value} {...props} />
            {!isValid && <span className='text-sm text-red-300'>error</span>}
            {currentCode && <span className='text-sm text-green-500'>{currentCode.name}</span>}
            <datalist id='project-codes'>
                {Object.entries(projectCodeMap).map(([key, code]) => (
                    <option key={key} value={code.id} label={code.name} />
                ))}
            </datalist>
        </>
    );
}
