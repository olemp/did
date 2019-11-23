
import { DetailsList, SelectionMode, ConstrainMode, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';
import { ICalEvent } from '../../../models';
import * as moment from 'moment';
require('moment/locale/en-gb');

function renderSubject(item: ICalEvent, _index: number, col: IColumn) {
    return <a href={item.webLink}>{item[col.fieldName]}</a>;
}

function renderDate(item: ICalEvent, _index: number, col: IColumn) {
    return moment(new Date(item[col.fieldName])).format('dddd HH:mm')
}

function renderDuration(item: ICalEvent, _index: number, col: IColumn) {
    return getDurationDisplay(item[col.fieldName]);
}

function renderProject(item: ICalEvent) {
    if (!item.project) return null;
    return <a href={`/projects?key=${item.project.key}`}>{item.project.name}</a>;
}


export const Columns: IColumn[] = [
    { key: 'subject', fieldName: 'subject', name: 'Subject', onRender: renderSubject, minWidth: 100, maxWidth: 180 },
    { key: 'startTime', fieldName: 'startTime', name: 'Start', onRender: renderDate, minWidth: 100, maxWidth: 140 },
    { key: 'endTime', fieldName: 'endTime', name: 'End', onRender: renderDate, minWidth: 100, maxWidth: 140 },
    { key: 'duration', fieldName: 'duration', name: 'Duration', onRender: renderDuration, minWidth: 100, maxWidth: 150 },
    { key: 'project', fieldName: 'project', name: 'Project', onRender: renderProject, minWidth: 100 },
];


export const EventList = ({ events }) => {
    return (
        <DetailsList
            columns={Columns}
            items={events}
            selectionMode={SelectionMode.none}
            constrainMode={ConstrainMode.horizontalConstrained}
            layoutMode={DetailsListLayoutMode.justified} />
    );
}