
import gql from 'graphql-tag';

export default gql`
    mutation($weekNumber: Int!) { 
        result: unconfirmWeek(weekNumber: $weekNumber) {
            success
	        error
        }
    }
`;