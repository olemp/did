import { IGetEventData } from '../GET_EVENT_DATA';

export interface IStatusBarProps {
    loading: boolean;
    isConfirmed: boolean;
    data: IGetEventData;
}
