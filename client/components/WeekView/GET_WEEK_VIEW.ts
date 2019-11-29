
import gql from 'graphql-tag';

export interface IGetWeekView {
  result: {
    events: any[];
    matchedDuration: number;
    totalDuration: number;
  };
  confirmedHours: number;
}

export const GET_WEEK_VIEW = gql`
query ($weekNumber: Int!) {
  confirmedHours(weekNumber: $weekNumber)
  result: getEvents(weekNumber: $weekNumber) {
    events {
      id
      title
      webLink
      durationMinutes
      startTime
      endTime
      project {
        id
        key
        name
      }
      customer {
        key
        name
      }
      projectKey
      customerKey
    }
    totalDuration
    matchedDuration
  }
}
`;
