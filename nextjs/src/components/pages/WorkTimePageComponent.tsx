import { State, WorkTimeInputData, WorkTimeInputDataSortableKeys } from '@/components/hooks/use-worktime-input-state';
import { ProjectCodeMap } from '@/components/inputs/inputs';
import { DateWorkTimeDetailInputForm } from '@/components/presentationals/DateWorkTimeDetailInputForm';
import Loading from '@/components/presentationals/Loading';
import NavHeader from '@/components/presentationals/NavHeader';
import TargetMonthSelect, { TargetMonthSelectProps } from '@/components/presentationals/TargetMonthSelect';
import TotalTime, { TotalTimeProps } from '@/components/presentationals/TotalTime';
import React from 'react';

type FormListProps = {
    dateStringList: string[];
    state: State;
    projectCodeMap: ProjectCodeMap;
    onAddData: (dateString: string) => void;
    onSort: (dateString: string, key: WorkTimeInputDataSortableKeys, orderBy: 'ASC' | 'DESC') => void;
    onChangeData: (dateString: string, data: WorkTimeInputData) => void;
    onDeleteData: (dateString: string, data: WorkTimeInputData) => void;
};

function FormList({
    dateStringList,
    state,
    projectCodeMap,
    onAddData,
    onChangeData,
    onDeleteData,
    onSort,
}: FormListProps) {
    return (
        <>
            {dateStringList.map((dateString) => (
                <DateWorkTimeDetailInputForm
                    key={dateString}
                    className='col-span-7 mb-10'
                    dateString={dateString}
                    totalTime={state[dateString]?.totalMinutes}
                    projectCodeMap={projectCodeMap}
                    workTimeInputDataList={[...(state[dateString]?.workTimeItems?.values() || [])]}
                    orderBy={state[dateString]?.orderBy}
                    onAddData={() => onAddData(dateString)}
                    onSort={(key, orderBy) => onSort(dateString, key, orderBy)}
                    onChangeData={(data) => onChangeData(dateString, data)}
                    onDeleteData={(data) => onDeleteData(dateString, data)}
                />
            ))}
        </>
    );
}

type FooterProps = Pick<TargetMonthSelectProps, 'defaultYYYYMM' | 'optionYYYYMM' | 'onChange' | 'desc'> &
    Pick<TotalTimeProps, 'time'>;

const Footer = ({ defaultYYYYMM, optionYYYYMM, onChange, time, desc }: FooterProps): JSX.Element => (
    <>
        <TargetMonthSelect
            defaultYYYYMM={defaultYYYYMM}
            optionYYYYMM={optionYYYYMM}
            className='col-span-1'
            onChange={onChange}
            desc={desc}
        />
        <div className='col-span-1 grid justify-center'>
            <TotalTime time={time} />
        </div>
        <div className='col-span-1 grid grid-cols-3'>
            <div className='col-span-2'></div>
            <button type='submit' className='bg-green-100 rounded hover:bg-green-300 col-span-1'>
                保存
            </button>
        </div>
    </>
);

export type WorkTimePageComponentProps = {
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
    loading?: boolean;
} & FormListProps &
    FooterProps;

export default function WorkTimePageComponent({
    onSubmit = () => {},
    loading = false,
    dateStringList,
    state,
    projectCodeMap,
    onSort,
    onAddData,
    onChangeData,
    onDeleteData,
    onChange,
    defaultYYYYMM,
    optionYYYYMM,
    time,
}: WorkTimePageComponentProps) {
    return (
        <form onSubmit={onSubmit}>
            <Loading show={loading} />
            <NavHeader />
            <div className='container mb-24 mx-auto max-w-4xl'>
                <FormList
                    dateStringList={dateStringList}
                    state={state}
                    projectCodeMap={projectCodeMap}
                    onAddData={onAddData}
                    onSort={onSort}
                    onChangeData={onChangeData}
                    onDeleteData={onDeleteData}
                />
            </div>
            <div className='w-full grid grid-cols-3 gap-4 bg-white fixed bottom-0 border-2 p-2'>
                <Footer onChange={onChange} defaultYYYYMM={defaultYYYYMM} optionYYYYMM={optionYYYYMM} time={time} />
            </div>
        </form>
    );
}
