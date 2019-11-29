import { ICalEvent } from "models";

export interface IEventListProps {
    events: ICalEvent[];
    enableShimmer?: boolean;
    hideColumns?: string[];
    dateFormat?: string;
}
