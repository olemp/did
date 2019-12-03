
import { getId } from '@uifabric/utilities';
import { UserMessage } from 'components/UserMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import * as format from 'string-format';
import { CreateProjectCallout } from './CreateProjectCallout';
import { ICalEvent } from 'models';

export interface IProjectSuggestionProps {
    event: ICalEvent;
    onProjectAdded: () => void;
}

/**
 * @component ProjectSuggestion
 * @description @todo
 */
export const ProjectSuggestion = ({ event, onProjectAdded }: IProjectSuggestionProps) => {
    let toggleId = getId('toggle-callout');
    const [callout, setCallout] = useState<Element>(null);
    const text = format(
        (
            'Event not matched correctly. ' +
            'We found <a href="#" id="{0}">`{1}`</a>, but that project does not exist. ' +
            'Did you mean<a style="display:block;" href="/projects#{2}">`{2}?`</a>'
        ),
        toggleId,
        `${event.customerKey} ${event.projectKey}`,
        event.suggestedProject.id,
    );
    return (
        <>
            <UserMessage
                text={text}
                type={MessageBarType.warning}
                iconName='Lightbulb'
                onClick={_ => setCallout(document.getElementById(toggleId))} />
            <CreateProjectCallout
                target={callout}
                customerKey={event.customerKey}
                projectKey={event.projectKey}
                onDismiss={() => setCallout(null)}
                onAdded={onProjectAdded} />
        </>
    );
}
