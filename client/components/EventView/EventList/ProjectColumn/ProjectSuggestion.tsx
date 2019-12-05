
import { getId } from '@uifabric/utilities';
import { UserMessage } from 'components/UserMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState, useEffect } from 'react';
import * as format from 'string-format';
import { CreateProjectCallout } from './CreateProjectCallout';
import { ICalEvent, IProject } from 'models';

export interface IProjectSuggestionProps {
    event: ICalEvent;
    onProjectAdded: () => void;
    suggestedProject: IProject;
    onProjectSelected?: (project: IProject) => void;
}

/**
 * @component ProjectSuggestion
 * @description @todo
 */
export const ProjectSuggestion = ({ event, onProjectAdded, onProjectSelected, suggestedProject }: IProjectSuggestionProps) => {
    let toggleId = getId('toggle-callout');
    const [callout, setCallout] = useState<Element>(null);

    return (
        <>
            <UserMessage
                type={MessageBarType.warning}
                iconName='Lightbulb'>
                <p>Event not matched correctly. We found <a href="#" onClick={_event => setCallout(document.getElementById(toggleId))} id={toggleId}>{event.customerKey} {event.projectKey}</a>, but that project does not exist.
                Did you mean <a href="#" onClick={_ => onProjectSelected(event.suggestedProject)}>{event.suggestedProject.id}</a>?</p>
        </UserMessage>
        <CreateProjectCallout
            target={callout}
            customerKey={event.customerKey}
            projectKey={event.projectKey}
            onDismiss={() => setCallout(null)}
            onAdded={onProjectAdded} />
        </>
    );
}
