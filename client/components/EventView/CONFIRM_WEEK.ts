
import gql from 'graphql-tag';

export default gql`
    mutation($entries: [TimeEntryInput!], $weekNumber: Int!) {
        confirmedHours: confirmWeek(entries: $entries, weekNumber: $weekNumber)
    }
`;
