
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, IDetailsHeaderProps, SelectionMode, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { IProjectsState } from './IProjectsState';
import { ProjectDetails } from './ProjectDetails';
import { getUrlParameter } from '../../helpers';

export class Projects extends React.Component<{}, IProjectsState> {
    private _selection: Selection;

    private _columns: IColumn[] = [
        { key: 'key', fieldName: 'key', name: 'Key', minWidth: 100, maxWidth: 100, },
        { key: 'name', fieldName: 'name', name: 'Name', minWidth: 100 }
    ];

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
        this._selection = new Selection({
            onSelectionChanged: () => this.setState({ selected: this._selection.getSelection()[0] })
        });
    }

    public async componentDidMount(): Promise<void> {
        let projects = await (await fetch('/api/projects', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })).json();
        this.setState({ projects, isLoading: false });
        let urlKey = getUrlParameter('key');
        if (urlKey) {
            this._selection.setKeySelected(urlKey, true, true);
        }
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
                {this.state.selected && <ProjectDetails project={this.state.selected} entries={[]} />}
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
}