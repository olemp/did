
import { Pivot, PivotItem, IPivotItemProps } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { getValueTyped as value } from 'helpers';
import * as moment from 'moment';
require('moment/locale/en-gb');


/**
 * Get periofds
 * 
 * @param {number} count Number of periofds
 */
const getPeriods = (count: number = 10): IPivotItemProps[] => {
    return Array.from(Array(count).keys())
        .map(i => moment().week() - (count - 1) + i)
        .map(wn => {
            return {
                key: wn.toString(),
                itemKey: wn.toString(),
                headerText: `Week ${wn}`,
            };
        });
}

export const PeriodSelector = ({ period, onChangePeriod }) => (
    <Pivot
        defaultSelectedKey={period.weekNumber.toString()}
        onLinkClick={onChangePeriod}>
        {getPeriods().map((props) => <PivotItem {...props} />)}
    </Pivot>
);