export interface ICalEvent {
    project: IProject;
    webLink: string;
    duration: number;
    subject: string;
    startTime: string;
    endTime: string;
}

export interface IProject {
    name: string;
    key: string;
}