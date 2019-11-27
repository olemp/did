import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { ISearchBoxProps } from 'office-ui-fabric-react/lib/SearchBox';
import { IProject } from '../../../models';

export interface IProjectListProps {
    projects: IProject[];
    search?: ISearchBoxProps;
    renderLink?: boolean;
    selection?: Selection;
    enableShimmer?: boolean;
    height: number;
}
