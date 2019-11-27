import { IProject } from './IProject';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';

export interface ICalEvent extends IObjectWithKey {
    id: string;
    title: string;
    project: IProject;
    webLink: string;
    durationMinutes: number;
    startTime: string;
    endTime: string;
}