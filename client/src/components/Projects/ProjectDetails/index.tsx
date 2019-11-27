import * as React from 'react';
import { ProjectTimeEntries } from './ProjectTimeEntries';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_CONFIRMED_ENTRIES = gql`
    query($projectKey: String!) {
        confirmedEntries(projectKey:$projectKey) {
            id,
            title,
            webLink,
            durationMinutes,
            startTime,
            endTime
        }
    }
`;

export const ProjectDetails = ({ project }) => {
    if (!project) return null;
    const { loading, error, data } = useQuery(GET_CONFIRMED_ENTRIES, { variables: { projectKey: project.key } });
    if (loading) {
        return <Spinner label='Loading...' />;
    }
    if (error) {
        return <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>;
    }
    return (
        <div style={{ marginTop: 20 }}>
            <h2>{project.name}</h2>
            <ProjectTimeEntries entries={data.confirmedEntries} />
        </div>
    );
};