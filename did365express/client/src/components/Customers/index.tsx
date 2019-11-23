
import * as React from 'react';
import { DetailsList, SelectionMode, ConstrainMode, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ICustomersState } from './ICustomersState';

export class Customers extends React.Component<{}, ICustomersState> {
    private _columns: IColumn[] = [{ key: 'name', fieldName: 'name', name: 'Name', minWidth: 100, maxWidth: 200 }];

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true, customers: [] };
    }

    public async componentDidMount(): Promise<void> {
        let customers = await (await fetch('/api/customers', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })).json();
        this.setState({ customers, isLoading: false });
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading customers....' />;
        }
        return (
            <div>
                <DetailsList
                    columns={this._columns}
                    items={this.state.customers}
                    selectionMode={SelectionMode.none}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    layoutMode={DetailsListLayoutMode.justified} />
                <div hidden={true}>
                    <TextField onChange={(_, newValue) => this.setState({ name: newValue })} placeholder='Customer name' />
                    <DefaultButton text='Add' onClick={this._onAddCustomer.bind(this)} />
                </div>
            </div>
        );
    }

    private async _onAddCustomer() {
        await fetch('/api/customers', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: this.state.name }),
        });
    }
}