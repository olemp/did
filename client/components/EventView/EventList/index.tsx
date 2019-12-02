
import { List, IColumn } from 'components/List';
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
        col('title', 'Title', { maxWidth: 180 }, (event: ICalEvent) => <a href={event.webLink} target='_blank'>{event.title}</a>),
        col('startTime', 'Start', { maxWidth: 140 }, (event: ICalEvent) => <DateColumn dateStr={event.startTime} dateFormat={props.dateFormat} />),
        col('endTime', 'End', { maxWidth: 140 }, (event: ICalEvent) => <DateColumn dateStr={event.endTime} dateFormat={props.dateFormat} />),
        col('durationMinutes', 'Duration', { maxWidth: 180 }, (event: ICalEvent) => <DurationDisplay minutes={event.durationMinutes} />),
        col('project', 'Project', { maxWidth: 240 }, (event: ICalEvent) => (
            <ProjectColumn
                event={event}
                isConfirmed={props.isConfirmed}
                onRefetch={props.onRefetch}
                onProjectSelected={project => props.onProjectSelected(event, project)} />
        )),
        col('customer', 'Customer', { maxWidth: 150 }, (event: ICalEvent) => <CustomerLink customer={event.customer} />),
    ].filter(col => (props.hideColumns || []).indexOf(col.key) === -1);

    return (
        <div>
            <List
                enableShimmer={props.enableShimmer}
                columns={columns}
                items={props.events} />
        </div>
    );
}