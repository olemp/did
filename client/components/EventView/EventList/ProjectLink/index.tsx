
import { UserMessage } from 'components/UserMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as format from 'string-format';
import * as React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import CREATE_PROJECT from './CREATE_PROJECT';
import { getId } from '@uifabric/utilities';

/**
 * @component ProjectLinkCallout
 * @description @todo
 */
export const ProjectLinkCallout = ({ customerKey, projectKey, target, onDismiss, onAdded }) => {
    let [model, setModel] = useState({ customerKey, projectKey, name: '' });
    let [addProject, { loading }] = useMutation(CREATE_PROJECT);
    const onFormSubmit =
        () => addProject({ variables: model }).then(
            ({ data }) => onAdded(data.result));

    return (
        <Callout
            className='c-projectlink-callout'
            hidden={!target}
            target={target}
            onDismiss={onDismiss}>
            <h4>Create new project</h4>
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
            <ProjectLinkCallout
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
export const ProjectLinkNoMatch = () => {
    return (
        <UserMessage
            text='Event not matched. Did you add a project key to the subject, body or category?'
            type={MessageBarType.severeWarning}
            iconName='SearchIssue' />
    );
}

/**
 * @component ProjectLink
 * @description @todo
 */
export const ProjectLink = ({ item, onRefetch }) => {
    if (!item.project) {
        let matchedKey = item.customerKey + ' ' + item.projectKey;
        if (item.suggestedProject) return <ProjectLinkSuggestion matchedKey={matchedKey} suggestedProject={item.suggestedProject} onRefetch={onRefetch} />;
        else if (item.customer) return <ProjectLinkCustomerMatch customer={item.customer.name} projectKey={item.projectKey} />;
        else if (item.customerKey) return <ProjectLinkInvalidMatch matchedKey={matchedKey} />;
        return <ProjectLinkNoMatch />
    }
    return <a href={`/projects#${item.project.key}`}>{item.project.name}</a>;
}
