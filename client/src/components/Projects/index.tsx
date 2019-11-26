
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import graphql from '../../data/graphql';
import { getUrlParameter } from '../../helpers';
import log from '../../utils/log';
import { IProjectsState } from './IProjectsState';
import { ProjectDetails } from './ProjectDetails';
import { ProjectList } from './ProjectList';

export class Projects extends React.Component<{}, IProjectsState> {
    private _selection: Selection;

    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
        this._selection = new Selection({});
    }

    public async componentDidMount(): Promise<void> {
        try {
            const projects = await this._getProjects();
            this.setState({ projects, isLoading: false });
            let urlKey = getUrlParameter('key');
            if (urlKey) this._selection.setKeySelected(urlKey, true, true);
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

    private async _getProjects() {
        const { projects } = await graphql.query<{ projects: any[] }>('{projects{key,customerKey,projectKey,name}}');
        return projects;
    }
}