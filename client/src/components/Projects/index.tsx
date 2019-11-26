
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import graphql from '../../data/graphql';
import log from '../../utils/log';
import { IProjectsState } from './IProjectsState';
import { ProjectDetails } from './ProjectDetails';
import { ProjectList } from './ProjectList';

export class Projects extends React.Component<{}, IProjectsState> {
    private _selection: Selection;

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
        this._selection = new Selection({ onSelectionChanged: this._onSelectionChanged.bind(this) });
    }

    public async componentDidMount(): Promise<void> {
        try {
            const projects = await this._getProjects();
            this.setState({ projects, isLoading: false });
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
            entries,
            selected,
        } = this.state;
        if (isLoading) {
            return <Spinner label='Loading projects....' />;
        }
        if (error) {
            return <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>;
        }
        return (
            <div>
                <ProjectList
                    height={300}
                    projects={projects}
                    selection={this._selection} />
                {selected && <ProjectDetails project={selected} entries={entries} />}
            </div >
        );
    }

    private async _onSelectionChanged() {
        const selected = this._selection.getSelection()[0];
        if (selected.key) {
            const { confirmedEntries: entries } = await graphql.usingCaching(true, 30).query<{ confirmedEntries: any[] }>('query($projectKey: String!){confirmedEntries(projectKey:$projectKey){id,title,webLink,durationMinutes,startTime,endTime}}', { projectKey: selected.key });
            this.setState({ entries });
        }
        this.setState({ selected });
    }

    private async _getProjects() {
        const { projects } = await graphql.usingCaching(true, 30).query<{ projects: any[] }>('{projects{key,customerKey,projectKey,name}}');
        return projects;
    }
}