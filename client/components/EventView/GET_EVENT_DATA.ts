
import gql from 'graphql-tag';
import { ICalEvent } from 'models';

export interface IGetEventData {
  events?: ICalEvent[];
  totalDuration?: number;
  confirmedDuration?: number;
  weeks?: { id: string, closed: boolean }[];
}

export interface IGetEventDataVariables {
  weekNumber: number;
}

export default gql`
query ($weekNumber: Int!) {
  weeks {
    id
    closed
  }
  eventData(weekNumber: $weekNumber) {
    events {
      key
      id
      title
      isOrganizer
      webLink
      durationMinutes
      durationHours
      startTime
      endTime
      projectKey
      customerKey
      project {
        id
        key
        name
        customer {          
          id       
          key
          name
        }
      }
      suggestedProject {
        id
        key
        name
        customer {   
          id       
          key
          name
        }
      }
      customer {
        id
        key
        name
      }
      overtime
    } 
    confirmedDuration
  }
}
`;
