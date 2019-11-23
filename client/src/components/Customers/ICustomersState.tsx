import { IProject } from '../../models';

export interface ICustomersState {
    isLoading: boolean;
    customers?: any[];
    projects?: IProject[];
    selected?: any;
}
