
import * as moment from 'moment';
import * as React from 'react';
require('moment/locale/en-gb');

export const Header = ({ weekNumber }) => {
    const week = moment().week(weekNumber);
    return (
        <h4 style={{ paddingBottom: 5, marginBottom: 15, borderBottom: '2px solid #44' }}>
            {week.startOf('isoWeek').format('MMMM Do') + " - " + week.endOf('isoWeek').format('MMMM Do')}
        </h4>
    )
}