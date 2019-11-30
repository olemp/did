
import gql from 'graphql-tag';

export default gql`
    mutation($entries: [TimeEntryInput!], $weekNumber: Int!) {
        confirmWeek(entries: $entries, weekNumber: $weekNumber)
    }
`;
