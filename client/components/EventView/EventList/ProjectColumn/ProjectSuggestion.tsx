
import { getId } from '@uifabric/utilities';
import { UserMessage } from 'components/UserMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import * as format from 'string-format';
import { CreateProjectCallout } from './CreateProjectCallout';

/**
 * @component ProjectSuggestion
 * @description @todo
 */
export const ProjectSuggestion = ({ matchedKey, suggestedProject, onRefetch }) => {
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
