import { IProject } from './IProject';
export interface ICalEvent {
    id: string;
    title: string;
    project: IProject;
    webLink: string;
    durationMinutes: number;
    startTime: string;
    endTime: string;
}
