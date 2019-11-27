
import { useQuery } from '@apollo/react-hooks';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { GET_PROJECTS, IGetProjectsEntries } from './GET_PROJECTS';
import { ProjectDetails } from './ProjectDetails';
import { ProjectList } from './ProjectList';
import { IProject } from '../../models';

export const Projects = () => {
    let selection: Selection;
    const [selected, setSelected] = React.useState<IProject>(null);
    const { loading, error, data } = useQuery<IGetProjectsEntries>(GET_PROJECTS);

    const onSelectionChanged = () => setSelected(selection.getSelection()[0] as IProject);
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
                selection={selection}
                search={{ placeholder: 'Search in projects...' }} />
            <ProjectDetails project={selected} />
        </div >
    );
}