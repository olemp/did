
import gql from 'graphql-tag';

export default gql`
    mutation($weekNumber: Int!) { 
        unconfirmWeek(weekNumber: $weekNumber)
    }
`;