import * as moment from 'moment';
import { ConstrainMode, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';
require('moment/locale/en-gb');
function renderTitle(item, _index, col) {
    return React.createElement("a", { href: item.webLink }, item[col.fieldName]);
}
function renderDate(item, _index, col) {
    return moment(new Date(item[col.fieldName])).format(col.data.dateFormat);
}
function renderDuration(item, _index, col) {
    return getDurationDisplay(item[col.fieldName]);
}
function renderProject(item) {
    if (!item.project) {
        return React.createElement(MessageBar, { messageBarType: MessageBarType.severeWarning }, "Event not matched.");
    }
    return React.createElement("a", { href: "/projects?key=" + item.project.key, target: '_blank' }, item.project.name);
}
export var EventListColumns = [
    { key: 'title', fieldName: 'title', name: 'Title', onRender: renderTitle, minWidth: 100, maxWidth: 180 },
    { key: 'startTime', fieldName: 'startTime', name: 'Start', onRender: renderDate, minWidth: 100, maxWidth: 140, data: { dateFormat: 'dddd HH:mm' } },
    { key: 'endTime', fieldName: 'endTime', name: 'End', onRender: renderDate, minWidth: 100, maxWidth: 140, data: { dateFormat: 'dddd HH:mm' } },
    { key: 'durationMinutes', fieldName: 'durationMinutes', name: 'Duration', onRender: renderDuration, minWidth: 100, maxWidth: 150 },
    { key: 'project', fieldName: 'project', name: 'Project', onRender: renderProject, minWidth: 100 },
];
export var EventList = function (_a) {
    var hidden = _a.hidden, events = _a.events, enableShimmer = _a.enableShimmer, _b = _a.hideColumns, hideColumns = _b === void 0 ? [] : _b;
    return (React.createElement("div", { hidden: hidden },
        React.createElement(ShimmeredDetailsList, { enableShimmer: enableShimmer, columns: EventListColumns.filter(function (col) { return hideColumns.indexOf(col.key) === -1; }), items: events, selectionMode: SelectionMode.none, constrainMode: ConstrainMode.horizontalConstrained, layoutMode: DetailsListLayoutMode.justified })));
};
//# sourceMappingURL=index.js.map