
import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, IDetailsHeaderProps, Selection, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { DataAdapter } from '../../data';
import { getUrlParameter } from '../../helpers';
import { IProjectsState } from './IProjectsState';
import { ProjectDetails } from './ProjectDetails';

export class Projects extends React.Component<{}, IProjectsState> {
    private _selection: Selection;

    private _columns: IColumn[] = [
        { key: 'key', fieldName: 'key', name: 'Key', minWidth: 100, maxWidth: 100, },
        { key: 'name', fieldName: 'name', name: 'Name', minWidth: 100 }
    ];

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
        this._selection = new Selection({ onSelectionChanged: this._onSelectionChanged.bind(this) });
    }

    public async componentDidMount(): Promise<void> {
        const projects = await new DataAdapter().getAllProjects();
        this.setState({ projects, isLoading: false });
        let urlKey = getUrlParameter('key');
        if (urlKey) this._selection.setKeySelected(urlKey, true, true);
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading projects....' />;
        }
        return (
            <div>
                <div style={{ position: 'relative', height: 300 }}>
                    <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
                        <DetailsList
                            selection={this._selection}
                            columns={this._columns}
                            items={this.state.projects}
                            selectionMode={SelectionMode.single}
                            constrainMode={ConstrainMode.horizontalConstrained}
                            layoutMode={DetailsListLayoutMode.justified}
                            onRenderDetailsHeader={this._onRenderDetailsHeader.bind(this)} />
                    </ScrollablePane>
                </div>
                {this.state.selected && <ProjectDetails project={this.state.selected} entries={this.state.entries} />}
            </div >
        );
    }

    private _onRenderDetailsHeader(detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>) {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                <SearchBox placeholder='Search projects...' />
                {defaultRender(detailsHeaderProps)}
            </Sticky>
        );
    }

    private async _onSelectionChanged() {
        const selected = this._selection.getSelection()[0];
        const entries = await new DataAdapter().getApprovedEntriesForProject(selected.key as string);
        console.log(entries);
        this.setState({ selected, entries });
    }
}