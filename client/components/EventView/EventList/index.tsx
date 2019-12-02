
import { List, IColumn } from 'components/List';
import { ICalEvent } from 'models';
import * as React from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { CustomerLink } from './CustomerLink';
import { DateColumn } from './DateColumn';
import { DurationDisplay } from './DurationDisplay';
import { IEventListProps } from './IEventListProps';
import { ProjectLink } from './ProjectLink';

export const EventList = ({ events, onRefetch = () => { }, onProjectSelected, enableShimmer, hideColumns = [], dateFormat }: IEventListProps) => {
    const columns = [
        col('title', 'Title', { maxWidth: 180 }, (event: ICalEvent) => <a href={event.webLink} target='_blank'>{event.title}</a>),
        col('startTime', 'Start', { maxWidth: 140, data: { dateFormat } }, (event: ICalEvent) => <DateColumn dateStr={event.startTime} dateFormat={dateFormat} />),
        col('endTime', 'End', { maxWidth: 140, data: { dateFormat } }, (event: ICalEvent) => <DateColumn dateStr={event.endTime} dateFormat={dateFormat} />),
        col('durationMinutes', 'Duration', { maxWidth: 180 }, (event: ICalEvent) => <DurationDisplay minutes={event.durationMinutes} />),
        col('project', 'Project', { maxWidth: 240, data: { onRefetch } }, (event: ICalEvent) => <ProjectLink event={event} onRefetch={onRefetch} onProjectSelected={project => onProjectSelected(event, project)} />),
        col('customer', 'Customer', { maxWidth: 150 }, (event: ICalEvent) => <CustomerLink customer={event.customer} />),
    ].filter(col => hideColumns.indexOf(col.key) === -1);

    return (
        <div>
            <List
                enableShimmer={enableShimmer}
                columns={columns}
                items={events} />
        </div>
    );
}