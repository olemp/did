
import { List } from 'components/List';
import { getValueTyped as value } from 'helpers';
import { ICalEvent } from 'models';
import * as moment from 'moment';
import * as React from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { CustomerLink } from './CustomerLink';
import { DurationDisplay } from './DurationDisplay';
import { IEventListProps } from './IEventListProps';
import { ProjectColumn } from './ProjectColumn';
require('moment/locale/en-gb');

export const EventList = (props: IEventListProps) => {
    const columns = [
        col(
            'title',
            'Title',
            { maxWidth: value(props, 'columnWidths.title', 270), minWidth: value(props, 'columnWidths.title', 270) },
            (event: ICalEvent) => <a href={event.webLink} target='_blank'>{event.title}</a>,
        ),
        col(
            'time',
            'Time',
            { maxWidth: value(props, 'columnWidths.time', 120), minWidth: value(props, 'columnWidths.time', 120) },
            (event: ICalEvent) => {
                return (
                    <span>
                        {moment(new Date(event.startTime)).format(props.dateFormat)} - {moment(new Date(event.endTime)).format(props.dateFormat)}
                    </span>
                )
            }
        ),
        col(
            'durationMinutes',
            'Duration',
            { maxWidth: value(props, 'columnWidths.durationMinutes', 75), minWidth: value(props, 'columnWidths.durationMinutes', 75) },
            (event: ICalEvent) => <DurationDisplay minutes={event.durationMinutes} />),
        col(
            'project',
            'Project',
            { maxWidth: value(props, 'columnWidths.project', 270), minWidth: value(props, 'columnWidths.project', 270) },
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
            { maxWidth: value(props, 'columnWidths.customer', 150), minWidth: value(props, 'columnWidths.customer', 150) },
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