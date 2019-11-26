import { ICalEvent } from "../../models";
import { ISpinnerProps } from 'office-ui-fabric-react/lib/Spinner';

export interface IWeekViewState {
    isLoading?: boolean;
    error?: any;
    spinner?: ISpinnerProps;
    weekNumber?: number;
    matchedHours?: number;
    confirmedHours?: number;
    isConfirmed?: boolean;
    totalHours?: number;
    events?: ICalEvent[];
}