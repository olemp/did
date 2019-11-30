import { IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ISearchBoxProps } from 'office-ui-fabric-react/lib/SearchBox';

export interface IListSelection {
    mode: SelectionMode;
    defaultSelectedKey?: string;
    onChanged: (selected: any) => void;
}

export interface IListProps {
    items: any[];
    columns?: IColumn[];
    enableShimmer?: boolean;
    height?: number;
    searchBox?: ISearchBoxProps;
    selection?: IListSelection;
}
