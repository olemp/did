import { ITimeEntry } from "models";

export interface IEventOverviewProps {
    events: ITimeEntry[];
    weekNumber?: number;
    isConfirmed?: boolean;
    enableShimmer?: boolean;
}
