
import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { IProject } from 'models';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import { getHash } from 'utils/getHash';
import { GET_PROJECTS, IGetProjectsEntries } from './GET_PROJECTS';
import { ProjectDetails } from './ProjectDetails';
import { ProjectList } from './ProjectList';
import { SelectionMode } from 'components/List';

export const Projects = () => {
    const [selected, setSelected] = useState<IProject>(null);
    const { loading, error, data } = useQuery<IGetProjectsEntries>(GET_PROJECTS, { variables: { sortBy: 'name' }, fetchPolicy: 'cache-first' });

    let projects: IProject[] = getValue(data, 'projects', { default: [] });

    if (getHash()) {
        let [_selected] = projects.filter(c => c.key === getHash());
        if (_selected && !selected) setSelected(_selected);
    }

    return (
        <div>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && (
                <ProjectList
                    height={300}
                    enableShimmer={loading}
                    items={projects}
                    searchBox={{ placeholder: 'Search in projects...' }}
                    selection={{ mode: SelectionMode.single, onChanged: selected => setSelected(selected) }} />
            )}
            {selected && <ProjectDetails project={selected} />}
        </div >
    );
}