import React from 'react';
import useWorkTimeInputState from '../hooks/use-worktime-input-state';
import { ProjectCodeMap } from '../inputs/inputs';
import useWorkTime from '../hooks/worktime';
import WorkTimeDetail from '@/domains/work-time-detail';
import { dateListOfMonth, formatDate, monthList, parseDate } from '@/domains/date';
import { addMonths } from 'date-fns';
import WorkTimePageComponent, { WorkTimePageComponentProps } from './WorkTimePageComponent';

export type WorkTimePageProps = {
    yyyyMM: string;
    projectCodeMap: ProjectCodeMap;
    onChangeMonth: WorkTimePageComponentProps['onChange'];
    workTimeDetails?: WorkTimeDetail[];
};

export default function WorkTimePage({
    yyyyMM,
    projectCodeMap,
    onChangeMonth,
    workTimeDetails = [],
}: WorkTimePageProps) {
    const { save } = useWorkTime();
    const { state, totalItems, totalMinutes, dispatch } = useWorkTimeInputState();
    const [loading, setLoading] = React.useState<boolean>(false);
    React.useEffect(() => {
        setLoading(true);
        dispatch({
            type: 'INITIALIZE',
            payload: {
                workTimeDetails,
            },
        });
        setLoading(false);
    }, [dispatch, workTimeDetails]);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const saveResult = await save(yyyyMM, totalItems);
        if (!saveResult) {
            alert('エラーが発生しました');
        }
        setLoading(false);
    };
    const dateStringList = React.useMemo(
        () =>
            dateListOfMonth(yyyyMM)
                .reverse()
                .map((date) => formatDate(date, 'yyyy-MM-dd')),
        [yyyyMM],
    );
    const onChamgeMonthWrapper = React.useCallback(
        async (yyyyMM: string) => {
            setLoading(true);
            await onChangeMonth(yyyyMM);
            setLoading(false);
        },
        [onChangeMonth],
    );
    const optionYYYYMM = React.useMemo(() => {
        const from = formatDate(addMonths(parseDate(yyyyMM, 'yyyyMM'), -5), 'yyyyMM');
        const to = formatDate(addMonths(parseDate(yyyyMM, 'yyyyMM'), 5), 'yyyyMM');
        return monthList(from, to).reverse();
    }, [yyyyMM]);
    return (
        <WorkTimePageComponent
            onSubmit={onSubmit}
            loading={loading}
            dateStringList={dateStringList}
            state={state}
            projectCodeMap={projectCodeMap}
            onAddData={(dateString) => dispatch({ type: 'UNSHIFT_ITEM', payload: { date: dateString } })}
            onSort={(dateString, key, orderBy) =>
                dispatch({ type: 'SORT_ITEM', payload: { date: dateString, key, orderBy } })
            }
            onChangeData={(dateString, data) => dispatch({ type: 'CHANGE_ITEM', payload: { date: dateString, data } })}
            onDeleteData={(dateString, data) => dispatch({ type: 'DELETE_ITEM', payload: { date: dateString, data } })}
            onChange={onChamgeMonthWrapper}
            defaultYYYYMM={yyyyMM}
            optionYYYYMM={optionYYYYMM}
            time={totalMinutes}
        />
    );
}
