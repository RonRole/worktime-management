import React from 'react';
import { WorkTimeInputData, WorkTimeInputDataSortableKeys } from '../hooks/use-worktime-input-state';
import WorkTimeInputTable, { WorkTimeInputTableProps } from './WorkTimeInputTable';
import { Minutes, toViewString } from '@/domains/time';
import { dayAsJpn, getDay, parseDate } from '@/domains/date';

export type DateWorkTimeDetailInputFormProps = {
    dateString: string;
    totalTime?: Minutes;
    projectCodeMap: WorkTimeInputTableProps['projectCodeMap'];
    workTimeInputDataList: WorkTimeInputTableProps['inputDataList'];
    orderBy?: WorkTimeInputTableProps['orderBy'];
    onAddData?: () => void;
    onSort?: (key: WorkTimeInputDataSortableKeys, order: 'ASC' | 'DESC') => void;
    onChangeData?: (data: WorkTimeInputData) => void;
    onDeleteData?: (data: WorkTimeInputData) => void;
} & React.ComponentProps<'div'>;

export function DateWorkTimeDetailInputForm({
    dateString,
    totalTime = 0,
    projectCodeMap,
    workTimeInputDataList,
    orderBy,
    onAddData = () => {},
    onSort = () => {},
    onChangeData = () => {},
    onDeleteData = () => {},
    className,
    ...props
}: DateWorkTimeDetailInputFormProps) {
    const getOrderDirection = (key: WorkTimeInputDataSortableKeys) =>
        orderBy === undefined || !orderBy[key] || orderBy[key] === 'ASC' ? 'DESC' : 'ASC';
    return (
        <div className={`grid grid-cols-7 ${className}`} {...props}>
            <div className='col-span-7 border-b-2'>
                <Header dateString={dateString} totalTime={totalTime} />
            </div>
            <button
                type='button'
                className='col-span-1 bg-blue-100 rounded hover:bg-blue-300'
                onClick={() => onAddData()}
            >
                追加
            </button>
            <WorkTimeInputTable
                className='col-span-7'
                projectCodeMap={projectCodeMap}
                inputDataList={workTimeInputDataList}
                orderBy={orderBy}
                onClickHeader={(key) => onSort(key, getOrderDirection(key))}
                onChangeData={onChangeData}
                onDeleteData={onDeleteData}
            />
        </div>
    );
}

type HeaderProps = { dateString: string; totalTime: Minutes };

const Header = ({ dateString, totalTime }: HeaderProps) => {
    const day = getDay(parseDate(dateString, 'yyyy-MM-dd'));
    return (
        <>
            <div className={`text-4xl font-extrabold ${day === 0 && 'text-red-500'} ${day === 6 && 'text-blue-500'}`}>
                {dateString}
            </div>
            <div className='text-sm text-gray-500'>{dayAsJpn(day)}</div>
            <div className='text-sm text-gray-500'>時間計 {toViewString(totalTime)}</div>
        </>
    );
};
