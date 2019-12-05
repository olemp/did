
import { List, IColumn } from 'components/List';
import * as moment from 'moment';
import * as React from 'react';
import { IEventOverviewProps } from './IEventOverviewProps';
import { generateColumn as col } from 'utils/generateColumn';
import * as _ from 'underscore';
import { IProject, ICalEvent } from 'models';
require('moment/locale/en-gb');

/**
 * @component LabelColumn
 * @description 
 */
const LabelColumn = ({ row }) => {
    if (row.label) {
        return (
            <div>
                {row.label}
            </div>
        )
    } else {
        return (
            <div>
                <div>{row.project.name}</div>
                <div style={{ fontSize: '7pt' }}>for {row.customer.name}</div>
            </div>
        )
    }
}

/**
 * Create columns
 * 
 * @param {number} weekNumber Week number
 */
const CreateColumns = (weekNumber: number) => {
    return [
        col('label', '', { minWidth: 250, maxWidth: 250 }, (row: any) => <LabelColumn row={row} />),
        ...Array.from(Array(7).keys()).map(i => {
            const day = moment().week(weekNumber).startOf('isoWeek').add(i, 'days');
            return col(day.format('L'), day.format('ddd Do'), { maxWidth: 80, minWidth: 80 });
        }),
        col('sum', 'Sum')
    ];
}

/**
 * Generate project rows
 * 
 * @param {IProject[]} projects Project
 * @param {ICalEvent[]} events Events
 * @param {IColumn[]} columns Columns
 */
const GenerateProjectRows = (projects: IProject[], events: ICalEvent[], columns: IColumn[]) => {
    return projects.map(project => {
        let projectEvents = events.filter(event => event.project.id === project.id);
        return [...columns].splice(1, 7).reduce((obj, col) => {
            obj[col.fieldName] = [...projectEvents]
                .filter(event => moment(event.startTime).format('L') === col.fieldName)
                .reduce((sum, event) => sum += event.durationHours, 0);
            return obj;
        }, {
            sum: projectEvents.reduce((sum, event) => sum += event.durationHours, 0),
            project,
            customer: project.customer,
        })
    });
}

/**
 * Generate total row
 * 
 * @param {ICalEvent[]} events Events
 * @param {IColumn[]} columns Columns
 */
const GenerateTotalRow = (events: ICalEvent[], columns: IColumn[]) => {
    return [...columns].splice(1, 7).reduce((obj, col) => {
        obj[col.fieldName] = [...events]
            .filter(event => moment(event.startTime).format('L') === col.fieldName)
            .reduce((sum, event) => sum += event.durationHours, 0);
        return obj;
    }, {
        label: 'Total',
        sum: events.reduce((sum, event) => sum += event.durationHours, 0),
    });
}

/**
 * @component EventOverview
 * @description 
 */
export const EventOverview = (props: IEventOverviewProps) => {
    const columns = CreateColumns(props.weekNumber);
    const events = props.events.filter(e => !!e.project);
    const projects = _.unique(events.map(e => e.project), p => p.id);
    const projectRows = GenerateProjectRows(projects, events, columns);
    const totalRow = GenerateTotalRow(events, columns);

    return (
        <div>
            <List
                enableShimmer={props.enableShimmer}
                columns={columns}
                items={[...projectRows, totalRow]} />
        </div>
    );
}