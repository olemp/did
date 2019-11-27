import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import * as React from 'react';
import { EventList } from '../../../WeekView/EventList';
export var ProjectTimeEntries = function (_a) {
    var entries = _a.entries;
    return (React.createElement("div", { style: { position: 'relative', height: 300 } },
        React.createElement(ScrollablePane, { scrollbarVisibility: ScrollbarVisibility.auto, styles: { contentContainer: { overflowX: 'hidden' } } },
            React.createElement(EventList, { events: entries, hideColumns: ['project'] }))));
};
//# sourceMappingURL=index.js.map