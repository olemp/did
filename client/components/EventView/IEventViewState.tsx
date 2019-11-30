import { IGetEventData } from './GET_EVENT_DATA';

export interface IEventViewState {
    loading?: boolean;
    weekNumber?: number;
    isConfirmed?: boolean;
    data?: IGetEventData;
}
