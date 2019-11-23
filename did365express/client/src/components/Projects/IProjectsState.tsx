import { IProject } from '../../models';

export interface IProjectsState {
    isLoading: boolean;
    projects?: IProject[];
    selected?: any;
    customerKey?: string;
    projectKey?: string;
    name?: string;
}
