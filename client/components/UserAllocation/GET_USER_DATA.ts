
import gql from 'graphql-tag';

export interface ITimeEntry {
  durationHours: number;
  customerKey: string;
  projectKey: string;
}

export default gql`
query ($userId: String!) {
  result: getConfirmedTimeEntries(resourceId: $userId) {
    entries {
      durationHours
      customerKey
      projectKey
    }
  }
}
`;
