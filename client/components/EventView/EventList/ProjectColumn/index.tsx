
import { getId } from '@uifabric/utilities';
import { UserMessage } from 'components/UserMessage';
import { ICalEvent, IProject } from 'models';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import * as format from 'string-format';
import { ResolveProjectModal } from './ResolveProjectModal';

interface IProjectColumnProps {
    event: ICalEvent;
    isConfirmed?: boolean;
    onRefetch?: () => void;
    onProjectSelected?: (project: IProject) => void;
}

/**
 * @component ProjectColumn
 * @description @todo
 */
export const ProjectColumn = ({ event, isConfirmed, onRefetch, onProjectSelected }: IProjectColumnProps) => {
    let toggleId = getId('toggle-callout');
    const [modal, setModal] = useState<boolean>(false);


    if (!event.project) {
        if (isConfirmed) return null;
        return (
            <>
                <UserMessage
                    style={{ width: 240 }}
                    text={format('Event not matched.<a href="#" id="{0}">Click to resolve</a>.', toggleId)}
                    type={MessageBarType.info}
                    iconName='SearchIssue'
                    onClick={() => setModal(true)} />
                <ResolveProjectModal
                    event={event}
                    onDismiss={() => setModal(false)}
                    isOpen={modal}
                    onProjectSelected={onProjectSelected} />
            </>
        );
    }
    return (
        <div>
            <div><a href={`/projects#${event.project.id}`}>{event.project.name}</a></div>
            <div style={{ fontSize: '7pt' }}>for <a style={{ fontSize: '7pt' }} href={`/customers#${event.customer.id}`}>{event.customer.name}</a></div>
        </div>
    );
}
