import { ICalEvent } from "../../models";

export interface IWeekViewState {
    isLoading?: boolean;
    weekNumber?: number;
    matchedHours?: number;
    confirmedHours?: number;
    totalHours?: number;
    events?: ICalEvent[];
    isConfirmed?: boolean;
    isConfirming?: boolean;
}