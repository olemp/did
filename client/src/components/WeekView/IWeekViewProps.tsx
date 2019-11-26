export interface IWeekViewProps {
    weeksToShow: number;
    loadingText?: string;
    graphqlquery?: string;
}

export const WeekViewDefaultProps: Partial<IWeekViewProps> = {
    loadingText: 'Loading your week from Outlook....',
    graphqlquery: 'query($weekNumber: Int!){confirmedHours(weekNumber: $weekNumber) weekView(weekNumber: $weekNumber){id,subject,webLink,duration,startTime,endTime,project{key,name}}}',
}