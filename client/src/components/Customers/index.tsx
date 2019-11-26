
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import graphql from '../../data/graphql';
import log from '../../utils/log';
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
        try {
            const customers = await this._getCustomers();
            this.setState({ customers, isLoading: false });
        } catch (error) {
            log.error('An error occured fetching data from backend.', error);
            this.setState({ error, isLoading: false });
        }

    }

    public render() {
        const {
            isLoading,
            error,
            projects,
            customers,
            selected,
        } = this.state;
        if (isLoading) {
            return <Spinner label='Loading customers....' />;
        }
        if (error) {
            return <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>;
        }
        return (
            <div>
                <CustomerList customers={customers} selection={this._selection} height={300} />
                {selected && <CustomerDetails customer={selected} projects={projects} />}
            </div>
        );
    }

    private async _onSelectionChanged() {
        const selected = this._selection.getSelection()[0];
        if (selected.key) {
            const { customerProjects: projects } = await graphql.usingCaching(true, 30).query<{ customerProjects: any[] }>('query customerProjects($customerKey: String!){customerProjects(customerKey: $customerKey){key,customerKey,name}}', { customerKey: selected.key });
            this.setState({ projects });
        }
        this.setState({ selected });
    }

    private async _getCustomers() {
        const { customers } = await graphql.usingCaching(true, 30).query<{ customers: any[] }>('{customers{key,customerKey,name}}');
        return customers;
    }
}