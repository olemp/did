
import * as moment from 'moment';
import { IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from 'helpers';
import { ICalEvent } from 'models';
import { List } from 'components/List';
import { IEventListProps } from './IEventListProps';
import { generateColumn as col } from 'utils/generateColumn';
require('moment/locale/en-gb');

function renderTitle(item: ICalEvent, _index: number, col: IColumn) {
    return <a href={item.webLink} target='_blank'>{item[col.fieldName]}</a>;
}

function renderDate(item: ICalEvent, _index: number, col: IColumn) {
    return moment(new Date(item[col.fieldName])).format(col.data.dateFormat);
}

function renderDuration(item: ICalEvent, _index: number, col: IColumn) {
    return getDurationDisplay(item[col.fieldName]);
}

function renderProject(item: ICalEvent) {
    if (!item.project) {
        return <MessageBar messageBarType={MessageBarType.severeWarning}>Event not matched.</MessageBar>
    }
    return <a href={`/projects?key=${item.project.key}`} target='_blank'>{item.project.name}</a>;
}

export const EventList = ({ hidden, events, enableShimmer, hideColumns = [], dateFormat = 'dddd HH:mm', }: IEventListProps) => {
    const columns = [
        col('title', 'Title', { maxWidth: 180 }, renderTitle),
        col('startTime', 'Start', { maxWidth: 140, data: { dateFormat } }, renderDate),
        col('endTime', 'End', { maxWidth: 140, data: { dateFormat } }, renderDate),
        col('durationMinutes', 'Duration', { maxWidth: 180 }, renderDuration),
        col('project', 'Project', { maxWidth: 150 }, renderProject),
    ].filter(col => hideColumns.indexOf(col.key) === -1);

    return (
        <div hidden={hidden}>
            <List
                enableShimmer={enableShimmer}
                columns={columns}
                items={events}
                selectionMode={SelectionMode.none} />
        </div>
    );
}