import { ICalEvent } from '../../../models';
export interface IEventListProps {
    events: ICalEvent[];
    hideColumns?: string[];
}
