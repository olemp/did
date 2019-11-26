export interface IReportsProps {
    fields: string[],
}

export const ReportsDefaultProps: Partial<IReportsProps> = {
    fields: ['subject', 'description', 'customerKey', 'projectKey', 'durationHours', 'startTime', 'endTime', 'weekNumber', 'yearNumber', 'webLink', 'durationHours', 'resourceName', 'resourceEmail'],
}