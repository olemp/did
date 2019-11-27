
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { ProjectDetails } from './ProjectDetails';
import { ProjectList } from './ProjectList';

export const GET_PROJECTS = gql`{
    projects{
        key,
        customerKey,
        projectKey,
        name
    }
}`;

export const Projects = () => {
    let selection: Selection;
    const [selected, setSelected] = React.useState(null);
    const { loading, error, data } = useQuery(GET_PROJECTS);

    const onSelectionChanged = () => setSelected(selection.getSelection()[0]);
    selection = new Selection({ onSelectionChanged });

    if (loading) {
        return <Spinner label='Loading projects....' />;
    }
    if (error) {
        return <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>;
    }
    return (
        <div>
            <ProjectList
                height={300}
                projects={data.projects}
                selection={selection} />
            <ProjectDetails project={selected} />
        </div >
    );
}