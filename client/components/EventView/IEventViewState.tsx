import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { IGetEventData } from './GET_EVENT_DATA';

export interface IEventViewState {
    /**
     * Data loading
     */
    loading?: boolean;

    /**
     * The selected view
     */
    selectedView?: string;

    /**
     * The currently selected week number
     */
    weekNumber?: number;

    /**
     * Is the week confirmed
     */
    isConfirmed?: boolean;

    /**
     * Data
     */
    data?: IGetEventData;

    /**
     * Group by
     */
    groupBy: IContextualMenuItem;
}