import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { List } from 'components/List';
import { IProjectListProps } from './IProjectListProps';
import { generateColumn as col } from 'utils/generateColumn';
import { IProject } from 'models';

export const ProjectList = (props: IProjectListProps) => {
    const columns: IColumn[] = [
        col(
            'icon',
            '',
            {},
            (item: IProject) => <Icon iconName={item.icon || 'Page'} styles={{ root: { fontSize: 16 } }} />,
        ),
        col('key', 'Key'),
        col(
            'name',
            'Name',
            {},
            item => props.renderLink ? <a href={`/projects?key=${item.key}`}>{item.name}</a> : item.name
        )
    ];

    return (
        <List
            height={props.height}
            enableShimmer={props.enableShimmer}
            columns={columns}
            items={props.items}
            searchBox={props.searchBox}
            onSelectionChanged={props.onSelectionChanged} />
    );

}
