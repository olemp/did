var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { ProjectList } from '../../Projects/ProjectList';
var GET_PROJECTS = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query($customerKey: String!) {\n        customerProjects(customerKey: $customerKey) {\n            key,\n            customerKey,\n            name\n        }\n    }\n"], ["\n    query($customerKey: String!) {\n        customerProjects(customerKey: $customerKey) {\n            key,\n            customerKey,\n            name\n        }\n    }\n"])));
export var CustomerDetails = function (_a) {
    var customer = _a.customer;
    if (!customer)
        return null;
    var _b = useQuery(GET_PROJECTS, { variables: { customerKey: customer.key } }), loading = _b.loading, error = _b.error, data = _b.data;
    if (loading) {
        return React.createElement(Spinner, { label: 'Loading...' });
    }
    if (error) {
        return React.createElement(MessageBar, { messageBarType: MessageBarType.error }, "An error occured.");
    }
    return (React.createElement("div", null,
        React.createElement("h2", null, customer.name),
        React.createElement("p", { hidden: !customer.description }, customer.description),
        React.createElement("p", { hidden: !customer.webLink },
            React.createElement("a", { href: customer.webLink }, customer.webLink)),
        React.createElement(ProjectList, { projects: data.customerProjects, search: { placeholder: "Search projects for " + customer.name + "..." }, renderLink: true, height: 300 })));
};
var templateObject_1;
//# sourceMappingURL=index.js.map