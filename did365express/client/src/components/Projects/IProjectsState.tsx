import { IProject, ICalEvent } from '../../models';

export interface IProjectsState {
    isLoading: boolean;
    projects?: IProject[];
    entries?: ICalEvent[];
    selected?: any;
    customerKey?: string;
    projectKey?: string;
    name?: string;
}
