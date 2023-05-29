import ProjectCode from './project-code';
import { Minutes } from './time';

export default class WorkTimeDetail {
    readonly id: number;
    readonly date?: Date;
    readonly projectCodeId?: ProjectCode['id'];
    readonly time?: Minutes;
    readonly content?: string;

    constructor(
        init: Pick<WorkTimeDetail, 'id'> & Pick<WorkTimeDetail, 'date' | 'projectCodeId' | 'time' | 'content'>,
    ) {
        Object.assign(this, init);
        this.id = init.id;
    }
}
