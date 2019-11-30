import { ScrollablePaneWrapper } from 'components/ScrollablePaneWrapper';
import { ConstrainMode, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { IListProps } from './IListProps';
import { ListHeader } from './ListHeader';

export const List = (props: IListProps) => {
    let searchTimeout: any;
    let selection: Selection;

    const onSelectionChanged = () => props.onSelectionChanged && props.onSelectionChanged(selection.getSelection()[0]);

    let [items, setItems] = useState(props.items);

    useEffect(() => setItems(props.items), [props.items]);

    selection = new Selection({ onSelectionChanged });

    const onSearch = (_event: any, term: string) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            let _items = props.items.filter(i => JSON.stringify(i).toLowerCase().indexOf(term.toLowerCase()) !== -1);
            setItems(_items);
        }, 500);
    }

    return (
        <div style={{ marginBottom: 25 }}>
            <ScrollablePaneWrapper condition={!!props.height} height={props.height}>
                <ShimmeredDetailsList
                    enableShimmer={props.enableShimmer}
                    selection={selection}
                    columns={props.columns}
                    items={items}
                    selectionMode={props.selectionMode}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    layoutMode={DetailsListLayoutMode.justified}
                    onRenderDetailsHeader={(headerProps, defaultRender) => ListHeader(headerProps, defaultRender, props, onSearch)} />
            </ScrollablePaneWrapper>
        </div>
    );
};

export { SelectionMode, IColumn }