
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';



function renderSubject(item: any, _index: number, col: IColumn) {
    return <a href={item.webLink}>{item[col.fieldName]}</a>;
}

function renderDate(item: any, _index: number, col: IColumn) {
    return new Date(item[col.fieldName]).toDateString();
}

function renderDuration(item: any, _index: number, col: IColumn) {
    return getDurationDisplay(item[col.fieldName]);
}

function renderProject(item: any, _index: number, col: IColumn) {
    if (!item[col.fieldName]) return null;
    return item[col.fieldName].name;
}


const Columns: IColumn[] = [
    { key: 'subject', fieldName: 'subject', name: 'Subject', onRender: renderSubject, minWidth: 100, maxWidth: 180 },
    { key: 'startTime', fieldName: 'startTime', name: 'Start', onRender: renderDate, minWidth: 100, maxWidth: 150 },
    { key: 'endTime', fieldName: 'endTime', name: 'End', onRender: renderDate, minWidth: 100, maxWidth: 150 },
    { key: 'duration', fieldName: 'duration', name: 'Duration', onRender: renderDuration, minWidth: 100, maxWidth: 150 },
    { key: 'project', fieldName: 'project', name: 'Project', onRender: renderProject, minWidth: 100 },
];


export const EventList = ({ events }) => {
    return <DetailsList columns={Columns} items={events} />;
}