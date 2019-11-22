
import * as React from 'react';
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IProjectsState } from './IProjectsState';

export class Projects extends React.Component<{}, IProjectsState> {
    private _columns: IColumn[] = [
        { key: 'projectKey', fieldName: 'projectKey', name: 'Project Key', minWidth: 100, maxWidth: 100, },
        { key: 'name', fieldName: 'name', name: 'Name', minWidth: 100 }
    ];

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true, projects: [] };
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
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading projects....' />;
        }
        return (
            <div>
                <DetailsList columns={this._columns} items={this.state.projects} />
                <div hidden={true}>
                    <TextField onChange={(_, newValue) => this.setState({ customerKey: newValue })} placeholder='Customer Key' />
                    <TextField onChange={(_, newValue) => this.setState({ projectKey: newValue })} placeholder='Project Key' />
                    <TextField onChange={(_, newValue) => this.setState({ name: newValue })} placeholder='Project Name' />
                    <DefaultButton text='Add' onClick={this._onAddProject.bind(this)} />
                </div>
            </div>
        );
    }

    private async _onAddProject() {
        await fetch('/api/projects', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerKey: this.state.customerKey,
                projectKey: this.state.projectKey,
                name: this.state.name,
            }),
        });
    }
}