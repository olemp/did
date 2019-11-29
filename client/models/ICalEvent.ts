import { IProject } from './IProject';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';
import { ICustomer } from './ICustomer';

export interface ICalEvent extends IObjectWithKey {
    id: string;
    title: string;
    project: IProject;
    customer: ICustomer;
    projectKey: string;
    customerKey: string;
    webLink: string;
    durationMinutes: number;
    startTime: string;
    endTime: string;
}