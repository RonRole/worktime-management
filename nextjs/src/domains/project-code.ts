export default class ProjectCode {
    readonly id: string;
    readonly name: string;

    constructor({ id, name }: Pick<ProjectCode, 'id' | 'name'>) {
        this.id = id;
        this.name = name;
    }
}
