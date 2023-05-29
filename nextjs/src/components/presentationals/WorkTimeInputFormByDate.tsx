import React from 'react';
import { WorkTimeState } from '../hooks/use-worktime-input-state';
import WorkTimeInputTable, { WorkTimeInputTableProps } from './WorkTimeInputTable';
import { ProjectCodeMap } from '../inputs/inputs';

export type WorkTimeInputFormByDateProps = {
    dateString: string;
    state: WorkTimeState;
    projectCodeMap: ProjectCodeMap;
    headerProps?: React.ComponentProps<'h1'>;
    buttonProps?: React.ComponentProps<'button'>;
    workTimeInputTableProps?: Omit<WorkTimeInputTableProps, 'projectCodeMap'>;
    tableWrapperProps?: React.ComponentProps<'div'>;
} & React.ComponentProps<'div'>;

export default function WorkTimeInputFormByDate({
    dateString,
    headerProps,
    projectCodeMap,
    buttonProps,
    workTimeInputTableProps,
    tableWrapperProps,
    ...props
}: WorkTimeInputFormByDateProps) {
    return (
        <div {...props}>
            <h1 {...headerProps}>{dateString}</h1>
            <div>
                <button {...buttonProps}>追加</button>
            </div>
            <div {...tableWrapperProps}>
                <WorkTimeInputTable projectCodeMap={projectCodeMap} {...workTimeInputTableProps} />
            </div>
        </div>
    );
}
