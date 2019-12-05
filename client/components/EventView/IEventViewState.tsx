import { IGetEventData } from './GET_EVENT_DATA';

export interface IEventViewPeriod {
    weekNumber?: number;
    yearNumber?: number;
    monthNumber?: number;
    quarter?: number;
}

export interface IEventViewState {
    loading?: boolean;
    selectedView?: string;
    period?: IEventViewPeriod;
    isConfirmed?: boolean;
    data?: IGetEventData;
}