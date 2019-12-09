import { ACTIONBAR_ICON_PROPS } from "./ACTIONBAR_ICON_PROPS";
import { ICalEvent } from "models";
import { getDurationDisplay } from "helpers";
import * as moment from 'moment';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
require('moment/locale/en-gb');
require('twix');

export const GROUP_BY_DAY: IContextualMenuItem = {
    key: 'GROUP_BY_DAY',
    name: 'Day',
    title: 'Group by day of the week',
    iconProps: { iconName: 'CalendarDay', ...ACTIONBAR_ICON_PROPS },
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