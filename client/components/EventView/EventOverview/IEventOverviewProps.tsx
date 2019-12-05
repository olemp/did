import { ICalEvent } from "models";

export interface IEventOverviewProps {
    events: ICalEvent[];
    weekNumber?: number;
    isConfirmed?: boolean;
    enableShimmer?: boolean;
}
