
import * as moment from 'moment';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { IActionBarProps } from './IActionBarProps';
import { ICalEvent } from 'models';
import { getDurationDisplay } from 'helpers';
require('moment/locale/en-gb');
require('twix');

const ActionBarIconProps: IIconProps = {
    styles: { root: { fontSize: 12, color: 'rgb(120, 120, 120)' } },
}

export const GROUP_BY_DAY = {
    key: 'GROUP_BY_DAY',
    name: 'Day',
    title: 'Group by day of the week',
    iconProps: { iconName: 'CalendarDay', ...ActionBarIconProps },
    data: {
        groups: {
            fieldName: 'day',
            groupNames: moment.weekdays(true),
            totalFunc: (items: ICalEvent[]) => {
                let totalMins = items.reduce((sum, i) => sum += i.durationMinutes, 0);
                return ` (${getDurationDisplay(totalMins)})`;
            },
        },
        hideColumns: [],
        dateFormat: 'HH:mm',
    },
};

export const GROUP_BY_PROJECT = {
    key: 'GROUP_BY_PROJECT',
    name: 'Project',
    title: 'Group by Project',
    iconProps: { iconName: 'ProjectCollection', ...ActionBarIconProps },
    data: {
        groups: {
            fieldName: 'project.name',
            emptyGroupName: '@Not matched',
            totalFunc: (items: ICalEvent[]) => {
                let totalMins = items.reduce((sum, i) => sum += i.durationMinutes, 0);
                return ` (${getDurationDisplay(totalMins)})`;
            },
        },
        hideColumns: [],
        dateFormat: 'ddd HH:mm',
    },
};

export const GROUP_BY_CUSTOMER = {
    key: 'GROUP_BY_CUSTOMER',
    name: 'Customer',
    title: 'Group by Customer',
    iconProps: { iconName: 'Work', ...ActionBarIconProps },
    data: {
        groups: {
            fieldName: 'customer.name',
            emptyGroupName: '@Not matched',
            totalFunc: (items: ICalEvent[]) => {
                let totalMins = items.reduce((sum, i) => sum += i.durationMinutes, 0);
                return ` (${getDurationDisplay(totalMins)})`;
            },
        },
        hideColumns: ['customer'],
        dateFormat: 'ddd HH:mm',
    },
};

export const ActionBar = ({ onClick, disabled, weekNumber, groupBy, onChangeWeek, onGroupByChanged }: IActionBarProps) => {
    const startOfWeek = moment().week(weekNumber).startOf('isoWeek');
    return (
        <CommandBar
            styles={{ root: { margin: '10px 0 10px 0', padding: 0 } }}
            items={[
                {
                    key: 'THIS_WEEK',
                    name: 'This week',
                    onClick: () => onChangeWeek(moment().week()),
                    disabled: weekNumber === moment().week(),
                },
                {
                    key: 'PREV_WEEK',
                    iconOnly: true,
                    iconProps: { iconName: 'Back', ...ActionBarIconProps },
                    onClick: () => onChangeWeek(weekNumber - 1),
                    title: 'Go to previous week',
                },
                {
                    key: 'NEXT_WEEK',
                    iconOnly: true,
                    iconProps: { iconName: 'Forward', ...ActionBarIconProps },
                    onClick: () => onChangeWeek(weekNumber + 1),
                    disabled: weekNumber === moment().week(),
                    title: 'Go to next week',
                },
                {
                    key: 'PICK_WEEK',
                    onRender: () => {
                        return (
                            <DatePicker
                                className='c-eventview-weekpicker'
                                calloutProps={{ className: 'c-eventview-weekpicker--callout' }}
                                borderless
                                textField={{
                                    styles: { field: { color: 'rgb(120, 120, 120)' }, root: { width: 250, marginTop: 6 } },
                                    iconProps: { iconName: 'ChevronDown', ...ActionBarIconProps }
                                }}
                                showCloseButton={true}
                                showWeekNumbers={true}
                                showGoToToday={false}
                                value={startOfWeek.toDate()}
                                maxDate={moment().endOf('isoWeek').toDate()}
                                formatDate={date => {
                                    let start = moment(date).startOf('isoWeek');
                                    let end = moment(date).endOf('isoWeek');
                                    return start['twix'](end, { allDay: true }).format({
                                        monthFormat: 'MMMM',
                                        yearFormat: 'YYYY',
                                        hideYear: false,
                                        implicitYear: false,
                                    }).toLowerCase();
                                }}
                                onSelectDate={date => onChangeWeek(moment(date).week())}
                                firstDayOfWeek={DayOfWeek.Monday} />
                        );
                    }
                },
                {
                    key: 'DIVIDER_0',
                    itemType: ContextualMenuItemType.Divider,
                },
                {
                    ...groupBy,
                    key: 'GROUP_BY',
                    subMenuProps: {
                        items: [
                            GROUP_BY_DAY,
                            GROUP_BY_PROJECT,
                            GROUP_BY_CUSTOMER,
                        ].map(item => ({
                            ...item,
                            canCheck: true,
                            checked: item.key === groupBy.key,
                            onClick: () => onGroupByChanged(item),
                        }))
                    }
                }
            ]}
            farItems={[
                {
                    key: 'CONFIRM_WEEK',
                    name: 'Confirm week',
                    iconProps: { iconName: 'CheckMark', ...ActionBarIconProps },
                    onClick: onClick.CONFIRM_WEEK,
                    disabled: disabled.CONFIRM_WEEK,
                },
                {
                    key: 'UNCONFIRM_WEEK',
                    name: 'Unconfirm week',
                    iconProps: { iconName: 'ErrorBadge', ...ActionBarIconProps },
                    onClick: onClick.UNCONFIRM_WEEK,
                    disabled: disabled.UNCONFIRM_WEEK,
                },
                {
                    key: 'RELOAD',
                    name: 'Reload',
                    iconProps: { iconName: 'Refresh', ...ActionBarIconProps },
                    onClick: onClick.RELOAD,
                    disabled: disabled.RELOAD,
                }
            ]}
        />
    )
}