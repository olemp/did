import { ICalEvent, IProject } from "models";
import { IListGroups } from "components/List/IListProps";

export interface IEventListProps {
    events: ICalEvent[];
    isConfirmed?: boolean;
    onRefetch?: () => void;
    onProjectSelected?: (event: ICalEvent, project: IProject) => void;
    enableShimmer?: boolean;
    hideColumns?: string[];
    dateFormat?: string;
    groups?: IListGroups;
}
