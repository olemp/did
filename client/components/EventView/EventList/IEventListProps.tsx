import { ICalEvent, IProject } from "models";

export interface IEventListProps {
    events: ICalEvent[];
    onRefetch?: () => void;
    onProjectSelected?: (event: ICalEvent, project: IProject) => void;
    enableShimmer?: boolean;
    hideColumns?: string[];
    dateFormat?: string;
}
