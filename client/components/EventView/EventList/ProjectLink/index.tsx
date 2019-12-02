
import { useMutation } from '@apollo/react-hooks';
import { getId } from '@uifabric/utilities';
import { UserMessage } from 'components/UserMessage';
import { ICalEvent, IProject } from 'models';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { useState } from 'react';
import * as AutoComplete from 'react-autocomplete';
import * as format from 'string-format';
import CREATE_PROJECT from './CREATE_PROJECT';
import { GET_PROJECTS } from 'components/Projects/GET_PROJECTS';
import { useQuery } from '@apollo/react-hooks';

/**
 * @component SearchProjectCallout
 * @description @todo
 */
export const SearchProjectCallout = ({ target, onSelected, onDismiss }) => {
    let [projects, setProjects] = useState(null);
    let [value, setValue] = useState('');
    const { loading, data } = useQuery(GET_PROJECTS, { skip: !!projects, variables: { sortBy: 'name' }, fetchPolicy: 'cache-first', });

    React.useEffect(() => { (!loading && !!data) && setProjects(data.projects); }, [data, loading]);

    return (
        <Callout
            style={{ width: 190 }}
            className='c-searchproject-callout'
            hidden={!target}
            target={target}
            onDismiss={onDismiss}>
            <h5>Search projects</h5>
            {!!projects && (
                <AutoComplete
                    getItemValue={item => item.name}
                    shouldItemRender={item => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 && value.length > 2}
                    items={projects}
                    renderItem={(item, isHighlighted) =>
                        <div key={item.key} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                            {item.name}
                        </div>
                    }
                    renderMenu={(items, _value, style) => <div className="autocomplete-dropdown-menu" style={style} children={items} />}
                    value={value}
                    onChange={(_event, value) => setValue(value)}
                    onSelect={(_val, item) => onSelected(item)} />
            )}
        </Callout>
    );
}

/**
 * @component CreateProjectCallout
 * @description @todo
 */
export const CreateProjectCallout = ({ customerKey, projectKey, target, onDismiss, onAdded }) => {
    let [model, setModel] = useState({ customerKey, projectKey, name: '' });
    let [addProject, { loading }] = useMutation(CREATE_PROJECT);
    const onFormSubmit =
        () => addProject({ variables: model }).then(
            ({ data }) => onAdded(data.result));

    return (
        <Callout
            className='c-createprojectcallout-callout'
            hidden={!target}
            target={target}
            onDismiss={onDismiss}>
            <h5>Create new project</h5>
            <TextField
                styles={{ root: { marginTop: 16 } }}
                placeholder={'Customer'}
                defaultValue={model.customerKey}
                disabled />
            <TextField
                styles={{ root: { marginTop: 8 } }}
                placeholder={'Key'}
                defaultValue={model.projectKey}
                disabled />
            <TextField
                styles={{ root: { marginTop: 8 } }}
                placeholder='Name'
                onChange={(_event, name) => setModel({ ...model, name })}
                disabled={loading} />
            <DefaultButton
                styles={{ root: { marginTop: 16, width: '100%' } }}
                text='Add'
                iconProps={{ iconName: 'CirclePlus' }}
                onClick={onFormSubmit}
                disabled={model.name.length < 3 || loading} />
        </Callout>
    );
}

/**
 * @component ProjectLinkSuggestion
 * @description @todo
 */
export const ProjectLinkSuggestion = ({ matchedKey, suggestedProject, onRefetch }) => {
    let toggleId = getId('toggle-callout');
    const [callout, setCallout] = useState<Element>(null);

    return (
        <>
            <UserMessage
                text={format((
                    'Event not matched correctly. ' +
                    'We found <span style="cursor:pointer;" id="{0}">`{1}`</span>, but that project does not exist. ' +
                    'Did you mean<a style="display:block;" href="/projects#{2}">`{2}?`</a>'
                ), toggleId, matchedKey, suggestedProject.key)}
                type={MessageBarType.warning}
                iconName='Lightbulb'
                onClick={_ => setCallout(document.getElementById(toggleId))} />
            <CreateProjectCallout
                target={callout}
                customerKey={matchedKey.split(' ')[0]}
                projectKey={matchedKey.split(' ')[1]}
                onDismiss={() => setCallout(null)}
                onAdded={() => onRefetch()} />
        </>
    );
}

/**
 * @component ProjectLinkCustomerMatch
 * @description @todo
 */
export const ProjectLinkCustomerMatch = ({ customer, projectKey }) => {
    return (
        <UserMessage
            text={format('Event not matched. We found a matching customer `{0}`, but not a project with key `{1}`.', customer, projectKey)}
            type={MessageBarType.warning}
            iconName='ProductList' />
    );
}

/**
 * @component ProjectLinkInvalidMatch
 * @description @todo
 */
export const ProjectLinkInvalidMatch = ({ matchedKey }) => {
    return (
        <UserMessage
            text={format('Event not matched. Found no match for `{0}`.', matchedKey)}
            type={MessageBarType.warning}
            iconName='SearchAndApps' />
    );
}

/**
 * @component ProjectLinkNoMatch
 * @description @todo
 */
export const ProjectLinkNoMatch = ({ isOrganizer = true, onProjectSelected }) => {
    let toggleId = getId('toggle-callout');
    const [callout, setCallout] = useState<Element>(null);

    if (!isOrganizer) {
        return (
            <>
                <UserMessage
                    text={format('Event not matched.<a href="#" id="{0}">`Click to select a project`</a>.', toggleId)}
                    type={MessageBarType.info}
                    iconName='SearchIssue'
                    onClick={_ => setCallout(document.getElementById(toggleId))} />
                <SearchProjectCallout
                    target={callout}
                    onDismiss={() => setCallout(null)}
                    onSelected={(project: IProject) => {
                        setCallout(null);
                        onProjectSelected(project);
                    }} />
            </>
        );
    }
    return (
        <UserMessage
            text='Event not matched. Did you add a project key to the subject, body or category?'
            type={MessageBarType.severeWarning}
            iconName='SearchIssue' />
    );
}

export interface IProjectLinkProps {
    event: ICalEvent;
    onRefetch?: () => void;
    onProjectSelected?: (project: IProject) => void;
}

/**
 * @component ProjectLink
 * @description @todo
 */
export const ProjectLink = ({ event, onRefetch, onProjectSelected }: IProjectLinkProps) => {
    if (!event.project) {
        if (!event.isOrganizer) return <ProjectLinkNoMatch isOrganizer={false} onProjectSelected={onProjectSelected} />
        let matchedKey = event.customerKey + ' ' + event.projectKey;
        if (event.suggestedProject) return <ProjectLinkSuggestion matchedKey={matchedKey} suggestedProject={event.suggestedProject} onRefetch={onRefetch} />;
        else if (event.customer) return <ProjectLinkCustomerMatch customer={event.customer.name} projectKey={event.projectKey} />;
        else if (event.customerKey) return <ProjectLinkInvalidMatch matchedKey={matchedKey} />;
        return <ProjectLinkNoMatch onProjectSelected={onProjectSelected} />
    }
    return <a href={`/projects#${event.project.key}`}>{event.project.name}</a>;
}
