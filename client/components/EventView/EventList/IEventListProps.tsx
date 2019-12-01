import { ICalEvent } from "models";

export interface IEventListProps {
    events: ICalEvent[];
    onRefetch?: () => void;
    enableShimmer?: boolean;
    hideColumns?: string[];
    dateFormat?: string;
}
