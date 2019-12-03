
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
    onRefetch: () => void;
}

/**
 * @component ProjectSuggestion
 * @description @todo
 */
export const ProjectSuggestion = ({ event, onRefetch }: IProjectSuggestionProps) => {
    let toggleId = getId('toggle-callout');
    const [callout, setCallout] = useState<Element>(null);

    return (
        <>
            <UserMessage
                text={format((
                    'Event not matched correctly. ' +
                    'We found <span style="cursor:pointer;" id="{0}">`{1}`</span>, but that project does not exist.' +
                    'Did you mean<a style="display:block;" href="/projects#{2}">`{2}?`</a>'
                ), toggleId, `${event.customerKey} ${event.projectKey}`, event.suggestedProject.id)}
                type={MessageBarType.warning}
                iconName='Lightbulb'
                onClick={_ => setCallout(document.getElementById(toggleId))} />
            <CreateProjectCallout
                target={callout}
                customerKey={event.customerKey}
                projectKey={event.projectKey}
                onDismiss={() => setCallout(null)}
                onAdded={() => onRefetch()} />
        </>
    );
}
