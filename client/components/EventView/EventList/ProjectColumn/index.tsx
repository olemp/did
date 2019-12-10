
import { getId } from '@uifabric/utilities';
import { UserMessage } from 'components/UserMessage';
import { ITimeEntry, IProject } from 'models';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { useState } from 'react';
import * as format from 'string-format';
import { ResolveProjectModal } from './ResolveProjectModal';

interface IProjectColumnProps {
    event: ITimeEntry;
    isConfirmed?: boolean;
    onProjectSelected?: (project: IProject) => void;
    onProjectClear?: (evt: React.MouseEvent<any>) => void;
}

/**
 * @component ProjectColumn
 * @description 
 */
export const ProjectColumn = ({ event, isConfirmed, onProjectSelected, onProjectClear }: IProjectColumnProps) => {
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
                    onProjectSelected={project => {
                        setModal(false);
                        onProjectSelected(project);
                    }} />
            </>
        );
    }
    return (
        <>
            <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
                <div><a href={`/projects#${event.project.id}`}>{event.project.name}</a></div>
                <div style={{ fontSize: '7pt' }}>for <a style={{ fontSize: '7pt' }} href={`/customers#${event.customer.id}`}>{event.customer.name}</a></div>
            </div>
            <div style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: 4 }} title='Clear' hidden={!event.isManualMatch}>
                <span onClick={onProjectClear} style={{ cursor: 'pointer' }}><Icon iconName='Cancel' styles={{ root: { fontSize: 14 } }} /></span>
            </div>
        </>
    );
}
