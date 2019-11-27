
import gql from 'graphql-tag';

export const UNCONFIRM_WEEK = gql`
    mutation($weekNumber: Int!) { 
        unconfirmWeek(weekNumber: $weekNumber)
    }
`;