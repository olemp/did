
import * as moment from 'moment';
import { ConstrainMode, DetailsListLayoutMode, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';
import { ICalEvent } from '../../../models';
import { IEventListProps } from './IEventListProps';
require('moment/locale/en-gb');

function renderTitle(item: ICalEvent, _index: number, col: IColumn) {
    return <a href={item.webLink}>{item[col.fieldName]}</a>;
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

export const EventListColumns: IColumn[] = [
    { key: 'title', fieldName: 'title', name: 'Title', onRender: renderTitle, minWidth: 100, maxWidth: 180 },
    { key: 'startTime', fieldName: 'startTime', name: 'Start', onRender: renderDate, minWidth: 100, maxWidth: 140, data: { dateFormat: 'dddd HH:mm' } },
    { key: 'endTime', fieldName: 'endTime', name: 'End', onRender: renderDate, minWidth: 100, maxWidth: 140, data: { dateFormat: 'dddd HH:mm' } },
    { key: 'durationMinutes', fieldName: 'durationMinutes', name: 'Duration', onRender: renderDuration, minWidth: 100, maxWidth: 150 },
    { key: 'project', fieldName: 'project', name: 'Project', onRender: renderProject, minWidth: 100 },
];

export const EventList = ({ hidden, events, enableShimmer, hideColumns = [] }: IEventListProps) => {
    return (
        <div hidden={hidden}>
            <ShimmeredDetailsList
                enableShimmer={enableShimmer}
                columns={EventListColumns.filter(col => hideColumns.indexOf(col.key) === -1)}
                items={events}
                selectionMode={SelectionMode.none}
                constrainMode={ConstrainMode.horizontalConstrained}
                layoutMode={DetailsListLayoutMode.justified} />
        </div>
    );
}