import { formatDate } from '@/domains/date';
import { totalMinutes as timeTotalMinutes, Minutes, split } from '@/domains/time';
import WorkTimeDetail from '@/domains/work-time-detail';
import React from 'react';

export type WorkTimeInputDataSortableKeys = 'date' | 'projectCodeId' | 'hours' | 'minutes' | 'content';

export class WorkTimeInputData {
    //
    readonly id: number;
    readonly date?: string;
    readonly projectCodeId?: string;
    readonly hours?: number;
    readonly minutes?: number;
    readonly content?: string;

    constructor(init: { id: number } & Partial<WorkTimeInputData>) {
        Object.assign(this, init);
        this.id = init.id;
    }

    getTotalMinutes(): number {
        return timeTotalMinutes({ hours: this.hours, minutes: this.minutes });
    }
}

export type WorkTimeState = {
    workTimeItems: Map<number, WorkTimeInputData>;
    totalMinutes: number;
    orderBy?: {
        [key in WorkTimeInputDataSortableKeys]: 'ASC' | 'DESC';
    };
};

export type State = Record<string, WorkTimeState>;

export type Action =
    | {
          type: 'INITIALIZE';
          payload: { workTimeDetails: WorkTimeDetail[] };
      }
    | {
          type: 'CHANGE_ITEM';
          payload: { date: string; data: WorkTimeInputData };
      }
    | {
          type: 'UNSHIFT_ITEM';
          payload: { date: string };
      }
    | {
          type: 'ADD_ITEM';
          payload: { date: string };
      }
    | {
          type: 'DELETE_ITEM';
          payload: { date: string; data: WorkTimeInputData };
      }
    | {
          type: 'SORT_ITEM';
          payload: {
              date: string;
              key: WorkTimeInputDataSortableKeys;
              orderBy: 'ASC' | 'DESC';
          };
      }
    | {
          type: 'CLEAR';
      };

const reducer: (state: State, action: Action) => State = (state, action) => {
    const getNewId = (date: string) => Math.max(...(state[date]?.workTimeItems?.keys() || []), 0) + 1;
    switch (action.type) {
        case 'INITIALIZE':
            return detailsToState(action.payload.workTimeDetails);
        case 'CHANGE_ITEM':
            // 更新内容の反映
            state[action.payload.date].workTimeItems.set(
                action.payload.data.id,
                new WorkTimeInputData({
                    ...action.payload.data,
                    date: action.payload.date,
                }),
            );
            // 合計分数の再計算
            state[action.payload.date].totalMinutes = [...state[action.payload.date].workTimeItems.values()].reduce(
                (pre, cur) => pre + cur.getTotalMinutes(),
                0,
            );
            return { ...state };
        case 'UNSHIFT_ITEM':
            state[action.payload.date] = state[action.payload.date] || {
                workTimeItems: new Map<number, WorkTimeInputData>(),
            };
            const unshiftId = getNewId(action.payload.date);
            state[action.payload.date].workTimeItems = new Map<number, WorkTimeInputData>([
                [unshiftId, new WorkTimeInputData({ id: unshiftId, date: action.payload.date })],
                ...state[action.payload.date].workTimeItems.entries(),
            ]);
            return { ...state };
        case 'ADD_ITEM':
            state[action.payload.date] = state[action.payload.date] || {
                workTimeItems: new Map<number, WorkTimeInputData>(),
            };
            const addId = getNewId(action.payload.date);
            state[action.payload.date].workTimeItems.set(
                addId,
                new WorkTimeInputData({ id: addId, date: action.payload.date }),
            );
            return { ...state };
        case 'DELETE_ITEM':
            state[action.payload.date].workTimeItems.delete(action.payload.data.id);
            // 合計分数の再計算
            state[action.payload.date].totalMinutes = [...state[action.payload.date].workTimeItems.values()].reduce(
                (pre, cur) => pre + cur.getTotalMinutes(),
                0,
            );
            return { ...state };
        case 'SORT_ITEM':
            state[action.payload.date] = state[action.payload.date] || {
                workTimeItems: new Map<number, WorkTimeInputData>(),
            };
            // 空文字,undefinedなら後ろに置く
            const sortedEntries = [...state[action.payload.date].workTimeItems.entries()].sort((a, b) => {
                const before = action.payload.orderBy === 'ASC' ? -1 : 1;
                const after = action.payload.orderBy === 'DESC' ? -1 : 1;
                const [keyA, keyB] = [a[1][action.payload.key], b[1][action.payload.key]];
                if (!keyA) {
                    return before;
                }
                if (!keyB) {
                    return after;
                }
                if (keyA === keyB) {
                    return 0;
                }
                return keyA < keyB ? before : after;
            });
            const workTimeItems = new Map(sortedEntries);
            const orderBy = Object.fromEntries([[action.payload.key, action.payload.orderBy]]) as State['']['orderBy'];
            state[action.payload.date] = {
                ...state[action.payload.date],
                workTimeItems,
                orderBy,
            };
            return {
                ...state,
            };
        case 'CLEAR':
            return {};
        default:
            return state;
    }
};

export type UseWorkTimeInputState = {
    state: State;
    totalItems: WorkTimeInputData[];
    totalMinutes: Minutes;
    dispatch: React.Dispatch<Action>;
};

const detailToInputData = (detail: WorkTimeDetail): WorkTimeInputData => {
    const [hours, minutes] = split(detail.time || 0);
    return new WorkTimeInputData({
        id: detail.id,
        date: detail.date ? formatDate(detail.date, 'yyyy-MM-dd') : '',
        projectCodeId: detail.projectCodeId,
        hours,
        minutes,
        content: detail.content,
    });
};

const detailsToState = (details: WorkTimeDetail[]): State =>
    details.reduce((pre, cur) => {
        const dateString = cur.date ? formatDate(cur.date, 'yyyy-MM-dd') : '';
        if (!pre[dateString]) {
            pre[dateString] = { workTimeItems: new Map<number, WorkTimeInputData>(), totalMinutes: 0 };
        }
        pre[dateString].workTimeItems.set(cur.id, detailToInputData(cur));
        pre[dateString].totalMinutes += cur.time || 0;
        return pre;
    }, {} as State);

export default function useWorkTimeInputState(): UseWorkTimeInputState {
    const [state, dispatch] = React.useReducer(reducer, {});
    const totalItems = React.useMemo(
        () =>
            Object.values(state)
                .map((item) => [...item.workTimeItems.values()])
                .reduce((pre, cur) => pre.concat(cur), []),
        [state],
    );
    const totalMinutes = React.useMemo(() => {
        const sumOfHours = totalItems.reduce((pre, cur) => pre + (cur.hours || 0), 0);
        const sumOfMinutes = totalItems.reduce((pre, cur) => pre + (cur.minutes || 0), 0);
        return timeTotalMinutes({
            hours: sumOfHours,
            minutes: sumOfMinutes,
        });
    }, [totalItems]);
    return {
        state,
        totalItems,
        totalMinutes,
        dispatch,
    };
}
