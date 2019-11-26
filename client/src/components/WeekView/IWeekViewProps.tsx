export interface IWeekViewProps {
    weeksToShow: number;
    loadingText?: string;
    query?: string;
}

export const WeekViewDefaultProps: Partial<IWeekViewProps> = {
    loadingText: 'Loading your week from Outlook....',
    query: 'query($weekNumber: Int!){confirmedHours(weekNumber: $weekNumber) weekView(weekNumber: $weekNumber){id,subject,webLink,duration,startTime,endTime,project{key,name}}}',
}