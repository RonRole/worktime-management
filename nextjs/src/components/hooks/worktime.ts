import axios, { AxiosError } from 'axios';
import { WorkTimeInputData } from './use-worktime-input-state';
import React from 'react';

export type UseWorkTime = {
    save(targetMonth: string, inputs: WorkTimeInputData[]): Promise<boolean>;
};

export default function useWorkTime() {
    const save: UseWorkTime['save'] = React.useCallback(async (targetMonth, inputs) => {
        try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/worktime`, {
                targetMonth,
                inputDataList: inputs.map((input) => {
                    return {
                        projectCodeId: input.projectCodeId,
                        date: input.date,
                        minutes: input.getTotalMinutes(),
                        content: input.content,
                    };
                }),
            });
            return result.status === 200;
        } catch (e: any) {
            console.log(e);
            return false;
        }
    }, []);
    return {
        save,
    };
}
