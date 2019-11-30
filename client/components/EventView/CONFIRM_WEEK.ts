
import gql from 'graphql-tag';

export default gql`
    mutation($entries: [TimeEntryInput!], $weekNumber: Int!) {
        result: confirmWeek(entries: $entries, weekNumber: $weekNumber) {
            success
	        error
        }
    }
`;
