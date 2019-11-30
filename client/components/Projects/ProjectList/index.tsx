import { List, IColumn, SelectionMode } from 'components/List';
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
            (item: IProject) => <Icon iconName={item.icon || 'Page'} styles={{ root: { fontSize: 16 } }} />,
        ),
        col('key', 'Key', { maxWidth: 120 }),
        col(
            'name',
            'Name',
            {},
            (item: IProject) => props.renderLink ? <a href={`/projects#${item.key}`}>{item.name}</a> : item.name
        )
    ];

    return (
        <List
            height={props.height}
            enableShimmer={props.enableShimmer}
            columns={columns}
            items={props.items}
            searchBox={props.searchBox}
            selectionMode={SelectionMode.single}
            onSelectionChanged={props.onSelectionChanged} />
    );

}
