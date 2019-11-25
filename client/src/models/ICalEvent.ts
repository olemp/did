import { IProject } from './IProject';

export interface ICalEvent {
    id: string;
    project: IProject;
    webLink: string;
    duration: number;
    subject: string;
    startTime: string;
    endTime: string;
}