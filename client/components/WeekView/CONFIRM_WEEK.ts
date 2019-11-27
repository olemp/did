
import gql from 'graphql-tag';

export interface IConfirmWeek {
    confirmWeek: number;
}

export const CONFIRM_WEEK = gql`
    mutation($entries:[TimeEntryInput!], $weekNumber: Int!) {
        confirmWeek(entries: $entries, weekNumber: $weekNumber)
    }
`;
