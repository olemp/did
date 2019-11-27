import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, IDetailsHeaderProps, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { IProjectListProps } from './IProjectListProps';

export const ProjectList = ({ projects, search, selection, height, renderLink }: IProjectListProps) => {
    let [filteredProjects, setProjects] = React.useState(projects);

    const onSearch = (_event: any, searchTerm: string) => setProjects(projects.filter(p => p.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1));

    const onRenderDetailsHeader = (props: IDetailsHeaderProps, render: IRenderFunction<IDetailsHeaderProps>) => {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                {search && <SearchBox {...search} onChange={onSearch} />}
                {render(props)}
            </Sticky>
        );
    }

    const columns: IColumn[] = [
        {
            key: 'key',
            fieldName: 'key',
            name: 'Key',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'name',
            fieldName: 'name',
            name: 'Name',
            minWidth: 100,
            onRender: item => renderLink ? <a href={`/projects?key=${item.key}`}>{item.name}</a> : item.name,
        }
    ];

    return (
        <div style={{ position: 'relative', height }}>
            <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
                <DetailsList
                    selection={selection}
                    columns={columns}
                    items={filteredProjects}
                    selectionMode={selection ? SelectionMode.single : SelectionMode.none}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    layoutMode={DetailsListLayoutMode.justified}
                    onRenderDetailsHeader={onRenderDetailsHeader} />
            </ScrollablePane>
        </div>
    );

}
