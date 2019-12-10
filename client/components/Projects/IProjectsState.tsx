import { IProject, ITimeEntry } from 'models';

export interface IProjectsState {
    isLoading: boolean;
    error?: any;
    projects?: IProject[];
    entries?: ITimeEntry[];
    selected?: any;
    customerKey?: string;
    projectKey?: string;
    name?: string;
}
