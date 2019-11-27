import { ICalEvent } from "../../../models";

export interface IEventListProps {
    events: ICalEvent[];
    hidden?: boolean;
    enableShimmer?: boolean;
    hideColumns?: string[];
}
