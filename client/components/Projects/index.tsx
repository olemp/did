
import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import { IProject } from 'models';
import { GET_PROJECTS, IGetProjectsEntries } from './GET_PROJECTS';
import { ProjectDetails } from './ProjectDetails';
import { ProjectList } from './ProjectList';

export const Projects = () => {
    const [selected, setSelected] = useState<IProject>(null);
    const { loading, error, data } = useQuery<IGetProjectsEntries>(GET_PROJECTS);

    return (
        <div>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && (
                <ProjectList
                    height={300}
                    enableShimmer={loading}
                    items={getValue(data, 'projects', { default: [] })}
                    searchBox={{ placeholder: 'Search in projects...' }}
                    onSelectionChanged={selected => setSelected(selected)} />
            )}
            {selected && <ProjectDetails project={selected} />}
        </div >
    );
}