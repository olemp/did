import { ICalEvent, IProject } from "models";
import { IListGroups } from "components/List/IListGroups";

export interface IEventListProps {
    /**
     * List of events
     */
    events: ICalEvent[];

    /**
     * Wether the event list is locked (adjustments can be done to project matching)
     */
    isLocked?: boolean;

    /**
     * Callback for refetch
     */
    onRefetch?: () => void;

    /**
     * Callback for when a project is selected for an event
     */
    onProjectSelected?: (event: ICalEvent, project: IProject) => void;

    /**
     * Enable shimmer
     */
    enableShimmer?: boolean;

    /**
     * An array of columns to hide from the view
     */
    hideColumns?: string[];

    /**
     * Date format
     */
    dateFormat?: string;

    /**
     * Groups to render
     */
    groups?: IListGroups;
}
