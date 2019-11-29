import { IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ISearchBoxProps } from 'office-ui-fabric-react/lib/SearchBox';

export interface IListProps {
    items: any[];
    columns?: IColumn[];
    enableShimmer?: boolean;
    height?: number;
    onSelectionChanged?: (selected: any) => void;
    searchBox?: ISearchBoxProps;
    selectionMode?: SelectionMode;
}
