var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { ConstrainMode, DetailsList, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import * as React from 'react';
export var ProjectList = function (_a) {
    var projects = _a.projects, search = _a.search, selection = _a.selection, height = _a.height, renderLink = _a.renderLink;
    var _b = React.useState(projects), filteredProjects = _b[0], setProjects = _b[1];
    var onSearch = function (_event, searchTerm) { return setProjects(projects.filter(function (p) { return p.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1; })); };
    var onRenderDetailsHeader = function (props, render) {
        return (React.createElement(Sticky, { stickyPosition: StickyPositionType.Header, isScrollSynced: true },
            search && React.createElement(SearchBox, __assign({}, search, { onChange: onSearch })),
            render(props)));
    };
    var columns = [
        {
            key: 'key',
            fieldName: 'key',
            name: 'Key',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'name',
            fieldName: 'name',
            name: 'Name',
            minWidth: 100,
            onRender: function (item) { return renderLink ? React.createElement("a", { href: "/projects?key=" + item.key }, item.name) : item.name; },
        }
    ];
    return (React.createElement("div", { style: { position: 'relative', height: height } },
        React.createElement(ScrollablePane, { scrollbarVisibility: ScrollbarVisibility.auto, styles: { contentContainer: { overflowX: 'hidden' } } },
            React.createElement(DetailsList, { selection: selection, columns: columns, items: filteredProjects, selectionMode: selection ? SelectionMode.single : SelectionMode.none, constrainMode: ConstrainMode.horizontalConstrained, layoutMode: DetailsListLayoutMode.justified, onRenderDetailsHeader: onRenderDetailsHeader }))));
};
//# sourceMappingURL=index.js.map