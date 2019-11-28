
import gql from 'graphql-tag';

export interface IConfirmWeek {
    confirmedHours: number;
}

export const CONFIRM_WEEK = gql`
    mutation($entries:[TimeEntryInput!], $weekNumber: Int!) {
        confirmedHours: confirmWeek(entries: $entries, weekNumber: $weekNumber)
    }
`;
