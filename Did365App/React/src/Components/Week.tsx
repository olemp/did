
import * as React from 'react';
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

export class Week extends React.Component<{}, any> {
    private _columns: IColumn[] = [
        { key: 'subject', fieldName: 'subject', name: 'Subject', minWidth: 100, maxWidth: 180 },
        { key: 'startTime', fieldName: 'startTime', name: 'Start', onRender: this._renderDate, minWidth: 100, maxWidth: 150 },
        { key: 'endTime', fieldName: 'endTime', name: 'End', onRender: this._renderDate, minWidth: 100, maxWidth: 150 },
        { key: 'project', fieldName: 'project', name: 'Project', onRender: this._renderProject, minWidth: 100 },
    ];

    constructor(props: {}) {
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
        console.log(events);
        this.setState({ events, isLoading: false });
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading your week....' />;
        }
        return (
            <div>
                <DetailsList columns={this._columns} items={this.state.events} />
            </div>
        );
    }

    private _renderDate(item: any, _index: number, col: IColumn) {
        return new Date(item[col.fieldName]).toDateString();
    }

    private _renderProject(item: any, _index: number, col: IColumn) {
        if (!item[col.fieldName]) return null;
        return item[col.fieldName].name;
    }
}