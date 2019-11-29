
import { List } from 'components/List';
import { getDurationDisplay } from 'helpers';
import { ICalEvent } from 'models';
import * as moment from 'moment';
import { IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { IEventListProps } from './IEventListProps';
import { UserMessage } from 'components/UserMessage';
require('moment/locale/en-gb');

function renderTitle(item: ICalEvent, _index: number, col: IColumn) {
    return <a href={item.webLink} target='_blank'>{item[col.fieldName]}</a>;
}

function renderDate(item: ICalEvent, _index: number, col: IColumn) {
    return moment(new Date(item[col.fieldName])).format(col.data.dateFormat || 'dddd HH:mm');
}

function renderDuration(item: ICalEvent, _index: number, col: IColumn) {
    return getDurationDisplay(item[col.fieldName]);
}

function renderProject(item: ICalEvent) {
    if (!item.project) {
        if (item.suggestedProject) return <UserMessage text={`Event not matched correctly. Did you mean \`${item.suggestedProject.key}\`?`} type={MessageBarType.warning} iconName='Lightbulb' />
        else if (item.customer) return <UserMessage text={`Event not matched. We found a matching customer \`${item.customer.name}\`, but not a project with key \`${item.projectKey}\`.`} type={MessageBarType.warning} iconName='ProductList' />;
        else if (item.customerKey) return <UserMessage text={`Event not matched. Found no match for \`${item.customerKey + ' ' + item.projectKey}\`.`} type={MessageBarType.warning} iconName='SearchAndApps' />;
        else return <UserMessage text='Event not matched. Did you add a project key to the subject, body or category?' type={MessageBarType.severeWarning} iconName='SearchIssue' />
    }
    return <a href={`/projects#${item.project.key}`}>{item.project.name}</a>;
}

function renderCustomer(item: ICalEvent) {
    if (!item.customer) {
        return null;
    }
    return <a href={`/customers#${item.customer.key}`}>{item.customer.name}</a>;
}

export const EventList = ({ events, enableShimmer, hideColumns = [], dateFormat }: IEventListProps) => {
    const columns = [
        col('title', 'Title', { maxWidth: 180 }, renderTitle),
        col('startTime', 'Start', { maxWidth: 140, data: { dateFormat } }, renderDate),
        col('endTime', 'End', { maxWidth: 140, data: { dateFormat } }, renderDate),
        col('durationMinutes', 'Duration', { maxWidth: 180 }, renderDuration),
        col('project', 'Project', { maxWidth: 240 }, renderProject),
        col('customer', 'Customer', { maxWidth: 150 }, renderCustomer),
    ].filter(col => hideColumns.indexOf(col.key) === -1);

    return (
        <List
            enableShimmer={enableShimmer}
            columns={columns}
            items={events}
            selectionMode={SelectionMode.none} />
    );
}