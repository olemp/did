import { ICalEvent } from "../../models";

export interface IWeekViewState {
    isLoading?: boolean;
    weekNumber?: number;
    matchedDuration?: number;
    totalDuration?: number;
    events?: ICalEvent[];
    isConfirmed?: boolean;
    isConfirming?: boolean;
}