var _this = this;
import { ConstrainMode, DetailsList, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import * as React from 'react';
export var CustomerListColumns = [
    { key: 'customerKey', fieldName: 'customerKey', name: 'Key', minWidth: 100, maxWidth: 100, },
    { key: 'name', fieldName: 'name', name: 'Name', minWidth: 100 }
];
function _onRenderDetailsHeader(detailsHeaderProps, defaultRender) {
    return (React.createElement(Sticky, { stickyPosition: StickyPositionType.Header, isScrollSynced: true },
        React.createElement(SearchBox, { placeholder: 'Search customers...', disabled: true }),
        defaultRender(detailsHeaderProps)));
}
export var CustomerList = function (_a) {
    var customers = _a.customers, selection = _a.selection, height = _a.height;
    return (React.createElement("div", { style: { position: 'relative', height: height } },
        React.createElement(ScrollablePane, { scrollbarVisibility: ScrollbarVisibility.auto, styles: { contentContainer: { overflowX: 'hidden' } } },
            React.createElement(DetailsList, { selection: selection, columns: CustomerListColumns, items: customers, selectionMode: SelectionMode.single, constrainMode: ConstrainMode.horizontalConstrained, layoutMode: DetailsListLayoutMode.justified, onRenderDetailsHeader: _onRenderDetailsHeader.bind(_this) }))));
};
//# sourceMappingURL=index.js.map