import React from 'react';
import ProjectCodesInput from './worktime-inputs/ProjectCodesInput';
import { ProjectCodeMap } from '../inputs/inputs';
import useWorkTimeInputState, {
    WorkTimeInputData,
    WorkTimeInputDataSortableKeys,
} from '../hooks/use-worktime-input-state';
import { WorkTimeContentInput, WorkTimeDateInput, WorkTimeHoursInput, WorkTimeMinutesInput } from './worktime-inputs';
import SortArrow from './SortArrow';

export type WorkTimeInputTableProps = {
    projectCodeMap: ProjectCodeMap;
    inputDataList?: WorkTimeInputData[];
    orderBy?: { [key in WorkTimeInputDataSortableKeys]: 'ASC' | 'DESC' };
    onClickHeader?: (key: WorkTimeInputDataSortableKeys) => void;
    onChangeData?: (data: WorkTimeInputData) => void;
    onDeleteData?: (data: WorkTimeInputData) => void;
} & React.ComponentProps<'div'>;

export default function WorkTimeInputTable({
    projectCodeMap,
    inputDataList = [],
    orderBy,
    onClickHeader = () => {},
    onChangeData = () => {},
    onDeleteData = () => {},
    className,
    ...props
}: WorkTimeInputTableProps) {
    return (
        <div className={`grid grid-cols-12 gap-x-1 gap-y-2 ${className}`} {...props}>
            <div
                className='font-semibold col-span-3 md:col-span-3 cursor-pointer'
                onClick={() => onClickHeader('projectCodeId')}
            >
                <span>プロジェクトコード{orderBy && <SortArrow orderBy={orderBy['projectCodeId']} />}</span>
            </div>
            <div
                className='font-semibold col-span-6 md:col-span-6 cursor-pointer'
                onClick={() => onClickHeader('content')}
            >
                <span>内容{orderBy && <SortArrow orderBy={orderBy['content']} />}</span>
            </div>
            <div className='font-semibold col-span-1 cursor-pointer' onClick={() => onClickHeader('hours')}>
                <span>時間{orderBy && <SortArrow orderBy={orderBy['hours']} />}</span>
            </div>
            <div className='font-semibold col-span-1 cursor-pointer' onClick={() => onClickHeader('minutes')}>
                <span>分{orderBy && <SortArrow orderBy={orderBy['minutes']} />}</span>
            </div>
            <div className='col-span-1'></div>
            {inputDataList.map((data) => (
                <div key={data.id} className='col-span-12 grid grid-cols-12 gap-1 hover:bg-gray-100'>
                    <div className='col-span-3 md:col-span-3'>
                        <ProjectCodesInput
                            className='block bg-transparent w-full border border-gray-300'
                            required
                            projectCodeMap={projectCodeMap}
                            value={data.projectCodeId}
                            onChange={(projectCodeId) =>
                                onChangeData(new WorkTimeInputData({ ...data, projectCodeId }))
                            }
                        />
                    </div>
                    <div className='col-span-6 md:col-span-6'>
                        <WorkTimeContentInput
                            value={data.content}
                            className='w-full bg-transparent border border-gray-300'
                            onChange={(content) => onChangeData(new WorkTimeInputData({ ...data, content }))}
                        />
                    </div>
                    <div className='col-span-1'>
                        <WorkTimeHoursInput
                            className='w-full bg-transparent border border-gray-300'
                            value={data.hours}
                            onChange={(hours) => onChangeData(new WorkTimeInputData({ ...data, hours }))}
                        />
                    </div>
                    <div className='col-span-1'>
                        <WorkTimeMinutesInput
                            className='w-full bg-transparent border border-gray-300'
                            onChange={(minutes) => onChangeData(new WorkTimeInputData({ ...data, minutes }))}
                            value={data.minutes}
                        />
                    </div>
                    <div className='col-span-1'>
                        <button
                            type='button'
                            className='w-full bg-red-100 hover:bg-red-300 rounded col-span-1'
                            onClick={() => onDeleteData(data)}
                        >
                            削除
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
