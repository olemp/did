
import * as React from 'react';
import { DetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

export class Week extends React.Component<{}, any> {
    constructor(props) {
        super(props);
        this.state = { isLoading: true, events: [] };
    }

    public async componentDidMount(): Promise<void> {
        let events = await (await fetch('/api/events', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })).json();
        this.setState({ events, isLoading: false });
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading your week....' />;
        }
        return (
            <div>
                <DetailsList columns={[{ key: 'subject', fieldName: 'subject', name: 'Subject', minWidth: 100 }]} items={this.state.events} />
            </div>
        );
    }
}