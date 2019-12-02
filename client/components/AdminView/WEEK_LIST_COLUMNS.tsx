import * as React from 'react';
import { generateColumn } from 'utils/generateColumn';
import { WeekStatusColumn } from './WeekStatusColumn';

export const WEEK_LIST_COLUMNS = [
    generateColumn('id', 'Week number', { maxWidth: 150 }),
    generateColumn('closed', undefined, undefined, (week: any) => <WeekStatusColumn weekNumber={parseInt(week.id)} closed={week.closed} />)
];