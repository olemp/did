
import { IColumn, IDetailsHeaderProps, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { DataAdapter } from '../../data';
import { CustomerDetails } from './CustomerDetails';
import { CustomerList } from './CustomerList';
import { ICustomersState } from './ICustomersState';

export class Customers extends React.Component<{}, ICustomersState> {
    private _selection: Selection;

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
        this._selection = new Selection({ onSelectionChanged: this._onSelectionChanged.bind(this) });
    }

    public async componentDidMount(): Promise<void> {
        const customers = await new DataAdapter().getAllCustomers();
        this.setState({ customers, isLoading: false });

    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading customers....' />;
        }
        return (
            <div>
                <CustomerList customers={this.state.customers} selection={this._selection} height={300} />
                {this.state.selected && <CustomerDetails customer={this.state.selected} projects={this.state.projects} />}
            </div>
        );
    }
    
    private async _onSelectionChanged() {
        const selected = this._selection.getSelection()[0];
        const projects = await new DataAdapter().getProjects(selected.key as string);
        this.setState({ selected, projects });
    }
}