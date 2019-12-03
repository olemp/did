import gql from 'graphql-tag';

export const GET_PROJECT_CONFIRMED_TIME_ENTRIES = gql`
    query($projectId: String) {
        result: getConfirmedTimeEntries(projectId: $projectId)  {
            entries {
                title
                durationHours
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