export interface IReportsProps {
    defaultFields: string[],
}

export const ReportsDefaultProps: Partial<IReportsProps> = {
    defaultFields: [
        'title',
        'description',
        'customerKey',
        'projectKey',
        'durationHours',
        'startTime',
        'endTime',
        'weekNumber',
        'yearNumber',
        'webLink',
        'durationHours',
        'resourceName',
        'resourceEmail',
    ],
}