
import { List } from 'components/List';
import { ICalEvent } from 'models';
import * as React from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { CustomerLink } from './CustomerLink';
import { DateColumn } from './DateColumn';
import { DurationDisplay } from './DurationDisplay';
import { IEventListProps } from './IEventListProps';
import { ProjectColumn } from './ProjectColumn';

export const EventList = (props: IEventListProps) => {
    const columns = [
        col(
            'title',
            'Title',
            { maxWidth: 270 },
            (event: ICalEvent) => <a href={event.webLink} target='_blank'>{event.title}</a>,
        ),
        col(
            'startTime',
            'Start', { maxWidth: 60, minWidth: 60 },
            (event: ICalEvent) => <DateColumn dateStr={event.startTime} dateFormat={props.dateFormat} />,
        ),
        col(
            'endTime',
            'End',
            { maxWidth: 60, minWidth: 60 },
            (event: ICalEvent) => <DateColumn dateStr={event.endTime} dateFormat={props.dateFormat} />,
        ),
        col(
            'durationMinutes',
            'Duration',
            { maxWidth: 75, minWidth: 75 },
            (event: ICalEvent) => <DurationDisplay minutes={event.durationMinutes} />),
        col(
            'project',
            'Project',
            { maxWidth: 270 },
            (event: ICalEvent) => (
                <ProjectColumn
                    event={event}
                    isConfirmed={props.isLocked}
                    onRefetch={props.onRefetch}
                    onProjectSelected={project => props.onProjectSelected(event, project)} />
            )),
        col(
            'customer',
            'Customer',
            { maxWidth: 150, minWidth: 150 },
            (event: ICalEvent) => <CustomerLink customer={event.customer} />,
        ),
    ].filter(col => (props.hideColumns || []).indexOf(col.key) === -1);

    return (
        <div style={{ marginBottom: 250 }}>
            <List
                enableShimmer={props.enableShimmer}
                columns={columns}
                items={props.events}
                groups={props.groups} />
        </div>
    );
}