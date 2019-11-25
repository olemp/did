import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, IDetailsHeaderProps, Selection, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { IProjectListProps } from './IProjectListProps';
import { IProjectListState } from './IProjectListState';

export const ProjectListColumns: IColumn[] = [
    { key: 'projectKey', fieldName: 'projectKey', name: 'Key', minWidth: 100, maxWidth: 100, },
    { key: 'name', fieldName: 'name', name: 'Name', minWidth: 100 }
];

export class ProjectList extends React.PureComponent<IProjectListProps, IProjectListState> {
    private _searchDelay = null;

    constructor(props: IProjectListProps) {
        super(props);
        this.state = { isLoading: true, searchTerm: '' };
    }

    public render() {
        return (
            <div style={{ position: 'relative', height: this.props.height }}>
                <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
                    <DetailsList
                        selection={this.props.selection}
                        columns={ProjectListColumns}
                        items={this.props.projects}
                        selectionMode={SelectionMode.single}
                        constrainMode={ConstrainMode.horizontalConstrained}
                        layoutMode={DetailsListLayoutMode.justified}
                        onRenderDetailsHeader={this._onRenderDetailsHeader.bind(this)} />
                </ScrollablePane>
            </div>
        );
    }

    private _onRenderDetailsHeader(props: IDetailsHeaderProps, render: IRenderFunction<IDetailsHeaderProps>) {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                <SearchBox placeholder='Search projects...' disabled onChange={this._onSearch.bind(this)} />
                {render(props)}
            </Sticky>
        );
    }

    private _onSearch(_e: React.ChangeEvent<any>, term: string) {
        if (this._searchDelay) clearTimeout(this._searchDelay);
        this._searchDelay = setTimeout(() => {
            this.setState({ searchTerm: term.toLowerCase() });
        }, 800);
    }
}