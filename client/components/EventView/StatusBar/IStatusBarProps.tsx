import { ICalEvent } from 'models';

export interface IStatusBarProps {
    loading: boolean;
    isConfirmed: boolean;
    events: ICalEvent[];
}
