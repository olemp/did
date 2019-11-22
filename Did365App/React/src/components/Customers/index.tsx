
import * as React from 'react';
import { DetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export class Customers extends React.Component<{}, any> {
    constructor(props) {
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
                <DetailsList columns={[{ key: 'name', fieldName: 'name', name: 'Name', minWidth: 100 }]} items={this.state.customers} />
                <TextField onChange={(_, newValue) => this.setState({ name: newValue })} placeholder='Customer name' />
                <DefaultButton text='Add' onClick={this._onAddCustomer.bind(this)} />
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