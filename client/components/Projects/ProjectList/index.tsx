import { IColumn, List } from 'components/List';
import { IProject } from 'models';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { IProjectListProps } from './IProjectListProps';

export const ProjectList = (props: IProjectListProps) => {
    const columns: IColumn[] = [
        col(
            'icon',
            '',
            { maxWidth: 60 },
            (project: IProject) => <Icon iconName={project.icon || 'Page'} styles={{ root: { fontSize: 16 } }} />,
        ),
        col('key', 'Key', { maxWidth: 120 }),
        col(
            'name',
            'Name',
            {},
            (project: IProject) => props.renderLink ? <a href={`/projects#${project.id}`}>{project.name}</a> : project.name
        )
    ];

    return (
        <List
            height={props.height}
            enableShimmer={props.enableShimmer}
            columns={columns}
            items={props.items}
            searchBox={props.searchBox}
            selection={props.selection} />
    );

}
