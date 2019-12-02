
import gql from 'graphql-tag';
import { ICalEvent } from 'models';

export interface IGetEventData {
  events?: ICalEvent[];
  matchedEvents?: ICalEvent[];
  matchedDuration?: number;
  totalDuration?: number;
  confirmedDuration?: number;
  weeks?: { id: string, closed: boolean }[];
}

export interface IGetEventDataVariables {
  weekNumber: number;
}

export default gql`
query ($weekNumber: Int!) {
  weeks: getWeeks {
    id
    closed
  }
  event_data: getEventData(weekNumber: $weekNumber) {
    events {
      id
      title
      isOrganizer
      webLink
      durationMinutes
      startTime
      endTime
      project {
        id
        key
        name
      }
      suggestedProject {
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
      overtime
    }
    matchedEvents {
      id
      project {
        id
        key
      }
    }
    totalDuration
    matchedDuration    
    confirmedDuration
  }
}
`;
