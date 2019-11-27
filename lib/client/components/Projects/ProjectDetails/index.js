var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import * as React from 'react';
import { ProjectTimeEntries } from './ProjectTimeEntries';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
export var GET_CONFIRMED_ENTRIES = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query($projectKey: String!) {\n        confirmedEntries(projectKey:$projectKey) {\n            id,\n            title,\n            webLink,\n            durationMinutes,\n            startTime,\n            endTime\n        }\n    }\n"], ["\n    query($projectKey: String!) {\n        confirmedEntries(projectKey:$projectKey) {\n            id,\n            title,\n            webLink,\n            durationMinutes,\n            startTime,\n            endTime\n        }\n    }\n"])));
export var ProjectDetails = function (_a) {
    var project = _a.project;
    if (!project)
        return null;
    var _b = useQuery(GET_CONFIRMED_ENTRIES, { variables: { projectKey: project.key } }), loading = _b.loading, error = _b.error, data = _b.data;
    if (loading) {
        return React.createElement(Spinner, { label: 'Loading...' });
    }
    if (error) {
        return React.createElement(MessageBar, { messageBarType: MessageBarType.error }, "An error occured.");
    }
    return (React.createElement("div", { style: { marginTop: 20 } },
        React.createElement("h2", null, project.name),
        React.createElement(ProjectTimeEntries, { entries: data.confirmedEntries })));
};
var templateObject_1;
//# sourceMappingURL=index.js.map