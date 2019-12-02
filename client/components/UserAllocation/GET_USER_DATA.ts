
import gql from 'graphql-tag';

export interface ITimeEntry {
  durationHours: number;
  customerKey: string;
  projectKey: string;
}

export default gql`
query ($resourceId: String, $weekNumber: Int, $yearNumber: Int, $currentUser: Boolean) {
  result: getConfirmedTimeEntries(resourceId: $resourceId, weekNumber: $weekNumber, yearNumber: $yearNumber, currentUser: $currentUser) {
    entries {
      durationHours
      customerKey
      projectKey
    }
  }
}
`;
