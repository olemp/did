
import { UserMessage } from 'components/UserMessage';
import { ICalEvent } from 'models';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as format from 'string-format';
import { getId } from '@uifabric/utilities';
import { CreateProjectCallout } from './CreateProjectCallout';
import { useState } from 'react';

export interface IProjectCustomerMatchProps {
    event: ICalEvent;
    onProjectAdded: () => void;
}

/**
 * @component ProjectCustomerMatch
 * @description @todo
 */
export const ProjectCustomerMatch = ({ event, onProjectAdded }: IProjectCustomerMatchProps) => {
    let toggleId = getId('toggle-callout');
    const [callout, setCallout] = useState<Element>(null);
    const text = format(
        'Event not matched. We found a matching customer `{0}`, but not a project with key <a href="#" id={1}>`{2}`</a>.',
        event.customer.name,
        toggleId,
        event.projectKey,
    );

    return (
        <>
            <UserMessage
                style={{ marginTop: 5 }}
                text={text}
                type={MessageBarType.warning}
                iconName='ProductList'
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