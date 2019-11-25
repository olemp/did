
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import graphql from '../../data/graphql';
import { CustomerDetails } from './CustomerDetails';
import { CustomerList } from './CustomerList';
import { ICustomersState } from './ICustomersState';

export class Customers extends React.Component<{}, ICustomersState> {
    private _selection: Selection;

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true, projects: [] };
        this._selection = new Selection({ onSelectionChanged: this._onSelectionChanged.bind(this) });
    }

    public async componentDidMount(): Promise<void> {
        const { customers } = await graphql.query<{ customers: any[] }>('{customers{key,customerKey,name}}');
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
        if (selected.key) {
            const { customerProjects: projects } = await graphql.query<{ customerProjects: any[] }>('query customerProjects($customerKey: String!){customerProjects(customerKey: $customerKey){key,customerKey,name}}', { customerKey: selected.key });
            this.setState({ projects });
        }
        this.setState({ selected });
    }
}