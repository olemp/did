import { ConstrainMode, DetailsList, DetailsListLayoutMode, IDetailsHeaderProps, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';

export const CustomerListColumns: IColumn[] = [
    { key: 'customerKey', fieldName: 'customerKey', name: 'Key', minWidth: 100, maxWidth: 100, },
    { key: 'name', fieldName: 'name', name: 'Name', minWidth: 100 }
];

function _onRenderDetailsHeader(detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>) {
    return (
        <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
            <SearchBox placeholder='Search customers...' />
            {defaultRender(detailsHeaderProps)}
        </Sticky>
    );
}

export const CustomerList = ({ customers, selection, height }) => (
    <div style={{ position: 'relative', height }}>
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
            <DetailsList
                selection={selection}
                columns={CustomerListColumns}
                items={customers}
                selectionMode={SelectionMode.single}
                constrainMode={ConstrainMode.horizontalConstrained}
                layoutMode={DetailsListLayoutMode.justified}
                onRenderDetailsHeader={_onRenderDetailsHeader.bind(this)} />
        </ScrollablePane>
    </div>
);