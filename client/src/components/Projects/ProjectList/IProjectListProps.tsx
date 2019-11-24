import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { IProject } from '../../../models';

export interface IProjectListProps {
    projects: IProject[];
    selection?: Selection;
    height: number;
}
