import { ICalEvent, IProject } from 'models';

export interface IProjectColumnProps {
    event: ICalEvent;
    isConfirmed?: boolean;
    onRefetch?: () => void;
    onProjectSelected?: (project: IProject) => void;
}
