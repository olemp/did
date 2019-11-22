interface ICalEvent {
    project: IProject;
    webLink: string;
    duration: number;
    eventId: string;
    subject: string;
    startTime: string;
    endTime: string;
    partitionKey: string;
    rowKey: string;
    timestamp: string;
    eTag?: any;
}

interface IProject {
    customerKey: string;
    projectKey: string;
    name: string;
    key: string;
    partitionKey: string;
    rowKey: string;
    timestamp: string;
    eTag: string;
}