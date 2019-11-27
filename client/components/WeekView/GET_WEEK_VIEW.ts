
import gql from 'graphql-tag';

export interface IGetWeekView {
    weekView: {
        events: any[];
        matchedDuration: number;
        totalDuration: number;
    };
    confirmedHours: number;
}

export const GET_WEEK_VIEW = gql`
    query($weekNumber: Int!) {
        confirmedHours(weekNumber: $weekNumber) 
        weekView(weekNumber: $weekNumber) {
            events {
                id,
                title,
                webLink,
                durationMinutes,
                startTime,
                endTime,
                project {
                    key,
                    name
                }
            },
            totalDuration,
            matchedDuration,
        }
    }
`;
