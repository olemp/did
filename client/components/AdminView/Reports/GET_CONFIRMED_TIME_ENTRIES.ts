import gql from 'graphql-tag';

export const GET_CONFIRMED_TIME_ENTRIES = gql`
    query($projectId: String) {
        result: getConfirmedTimeEntries(projectId: $projectId)  {
            entries {
                title
                customerKey
                projectId
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