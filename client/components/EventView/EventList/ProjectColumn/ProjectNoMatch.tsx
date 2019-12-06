
import { getId } from '@uifabric/utilities';
import { UserMessage } from 'components/UserMessage';
import { IProject } from 'models';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import * as format from 'string-format';
import { SearchProjectCallout } from './SearchProjectCallout';

/**
 * @component ProjectNoMatch
 * @description @todo
 */
export const ProjectNoMatch = ({ isOrganizer = true, onProjectSelected }) => {
    let toggleId = getId('toggle-callout');
    const [callout, setCallout] = useState<Element>(document.getElementById(toggleId));

    if (!isOrganizer) {
        return (
            <>
                <UserMessage
                    style={{ marginTop: 5, width: 240 }}
                    text={format('Event not matched.<a href="#" id="{0}">Click to resolve</a>.', toggleId)}
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
            text='Event not matched. Found no match for any project in event.'
            type={MessageBarType.severeWarning}
            iconName='TagUnknown' />
    );
}