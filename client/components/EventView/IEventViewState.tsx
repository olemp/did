import { IGetEventData } from './GET_EVENT_DATA';

export interface IEventViewState {
    loading?: boolean;
    selectedView?: string;
    weekNumber?: number;
    isConfirmed?: boolean;
    data?: IGetEventData;
}
