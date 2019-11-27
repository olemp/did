var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { ProjectDetails } from './ProjectDetails';
import { ProjectList } from './ProjectList';
export var GET_PROJECTS = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{\n    projects{\n        key,\n        customerKey,\n        projectKey,\n        name\n    }\n}"], ["{\n    projects{\n        key,\n        customerKey,\n        projectKey,\n        name\n    }\n}"])));
export var Projects = function () {
    var selection;
    var _a = React.useState(null), selected = _a[0], setSelected = _a[1];
    var _b = useQuery(GET_PROJECTS), loading = _b.loading, error = _b.error, data = _b.data;
    var onSelectionChanged = function () { return setSelected(selection.getSelection()[0]); };
    selection = new Selection({ onSelectionChanged: onSelectionChanged });
    if (loading) {
        return React.createElement(Spinner, { label: 'Loading projects....' });
    }
    if (error) {
        return React.createElement(MessageBar, { messageBarType: MessageBarType.error }, "An error occured.");
    }
    return (React.createElement("div", null,
        React.createElement(ProjectList, { height: 300, projects: data.projects, selection: selection }),
        React.createElement(ProjectDetails, { project: selected })));
};
var templateObject_1;
//# sourceMappingURL=index.js.map