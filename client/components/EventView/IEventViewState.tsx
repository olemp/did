import { IGetEventData } from './GET_EVENT_DATA';

export interface IEventViewState {
    loading?: boolean;
    weekNumber?: number;
    processing?: boolean;
    isConfirmed?: boolean;
    data?: IGetEventData;
}
