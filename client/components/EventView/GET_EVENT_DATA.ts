
import gql from 'graphql-tag';
import { ICalEvent } from 'models';

export interface IGetEventData {
  events?: ICalEvent[];
  matchedEvents?: ICalEvent[];
  matchedDuration?: number;
  totalDuration?: number;
  confirmedDuration?: number;
}

export interface IGetEventDataVariables {
  weekNumber: number;
}

export default gql`
query ($weekNumber: Int!) {
  event_data: getEvents(weekNumber: $weekNumber) {
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
