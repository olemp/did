
import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, IDetailsHeaderProps, Selection, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { DataAdapter } from '../../data';
import { ICustomersState } from './ICustomersState';
import { CustomerDetails } from './CustomerDetails';

export class Customers extends React.Component<{}, ICustomersState> {
    private _selection: Selection;
    private _columns: IColumn[] = [
        { key: 'key', fieldName: 'key', name: 'Key', minWidth: 100, maxWidth: 200 },
        { key: 'name', fieldName: 'name', name: 'Name', minWidth: 100, maxWidth: 200 },
    ];

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
        this._selection = new Selection({ onSelectionChanged: this._onSelectionChanged.bind(this) });
    }

    public async componentDidMount(): Promise<void> {
        const customers = await new DataAdapter().getAllCustomers();
        console.log(customers);
        this.setState({ customers, isLoading: false });

    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading customers....' />;
        }
        return (
            <div>
                <div style={{ position: 'relative', height: 300 }}>
                    <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
                        <DetailsList
                            selection={this._selection}
                            columns={this._columns}
                            items={this.state.customers}
                            selectionMode={SelectionMode.single}
                            constrainMode={ConstrainMode.horizontalConstrained}
                            layoutMode={DetailsListLayoutMode.justified}
                            onRenderDetailsHeader={this._onRenderDetailsHeader.bind(this)} />
                    </ScrollablePane>
                </div>
                {this.state.selected && <CustomerDetails customer={this.state.selected} projects={this.state.projects} />}
            </div>
        );
    }

    private _onRenderDetailsHeader(detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>) {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                <SearchBox placeholder='Search customers...' />
                {defaultRender(detailsHeaderProps)}
            </Sticky>
        );
    }

    private async _onSelectionChanged() {
        const selected = this._selection.getSelection()[0];
        const projects = await new DataAdapter().getProjects(selected.key as string);
        this.setState({ selected, projects });
    }
}