import gql from 'graphql-tag';

export const GET_CONFIRMED_TIME_ENTRIES = gql`
    query($projectKey: String) {
        result: getConfirmedTimeEntries(projectKey: $projectKey)  {
            entries {
                title
                customerKey
                projectKey
                durationHours
                durationMinutes
                startTime
                endTime
                weekNumber
                yearNumber
                resourceName
            }
            duration
        }
    }
`;