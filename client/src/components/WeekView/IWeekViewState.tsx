import * as moment from 'moment';
import { ICalEvent } from 'models';
require('moment/locale/en-gb');

export interface IWeekViewState {
    isLoading: boolean;
    weekNumber: number;
    matchedDuration?: number;
    totalDuration?: number;
    events: ICalEvent[];
    isConfirmed?: boolean;
    isConfirming?: boolean;
    startOfWeek?: moment.Moment;
}