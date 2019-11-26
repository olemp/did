import { IProject, ICalEvent } from '../../models';

export interface IProjectsState {
    isLoading: boolean;
    error?: any;
    projects?: IProject[];
    entries?: ICalEvent[];
    selected?: any;
    customerKey?: string;
    projectKey?: string;
    name?: string;
}
