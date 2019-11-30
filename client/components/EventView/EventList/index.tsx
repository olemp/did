
import { List } from 'components/List';
import { ICalEvent } from 'models';
import { SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { CustomerLink } from './CustomerLink';
import { DateColumn } from './DateColumn';
import { DurationDisplay } from './DurationDisplay';
import { IEventListProps } from './IEventListProps';
import { ProjectLink } from './ProjectLink';
require('moment/locale/en-gb');


export const EventList = ({ events, enableShimmer, hideColumns = [], dateFormat }: IEventListProps) => {
    const columns = [
        col('title', 'Title', { maxWidth: 180 }, (item: ICalEvent) => <a href={item.webLink} target='_blank'>{item.title}</a>),
        col('startTime', 'Start', { maxWidth: 140, data: { dateFormat } }, (item: ICalEvent) => <DateColumn dateStr={item.startTime} dateFormat={dateFormat} />),
        col('endTime', 'End', { maxWidth: 140, data: { dateFormat } }, (item: ICalEvent) => <DateColumn dateStr={item.endTime} dateFormat={dateFormat} />),
        col('durationMinutes', 'Duration', { maxWidth: 180 }, (item: ICalEvent) => <DurationDisplay minutes={item.durationMinutes} />),
        col('project', 'Project', { maxWidth: 240 }, (item: ICalEvent) => <ProjectLink item={item} />),
        col('customer', 'Customer', { maxWidth: 150 }, (item: ICalEvent) => <CustomerLink customer={item.customer} />),
    ].filter(col => hideColumns.indexOf(col.key) === -1);

    return (
        <div>
            <List
                enableShimmer={enableShimmer}
                columns={columns}
                items={events}
                selectionMode={SelectionMode.none} />
        </div>
    );
}