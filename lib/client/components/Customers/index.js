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
import { CustomerList } from './CustomerList';
import { CustomerDetails } from './CustomerDetails';
var GET_CUSTOMERS = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n{\n    customers {\n        key,\n        customerKey,\n        name,\n        description,\n        webLink\n    }\n}"], ["\n{\n    customers {\n        key,\n        customerKey,\n        name,\n        description,\n        webLink\n    }\n}"])));
export var Customers = function () {
    var selection;
    var _a = React.useState(null), selected = _a[0], setSelected = _a[1];
    var _b = useQuery(GET_CUSTOMERS), loading = _b.loading, error = _b.error, data = _b.data;
    var onSelectionChanged = function () {
        setSelected(selection.getSelection()[0]);
    };
    selection = new Selection({ onSelectionChanged: onSelectionChanged });
    if (loading) {
        return React.createElement(Spinner, { label: 'Loading customers....' });
    }
    if (error) {
        return React.createElement(MessageBar, { messageBarType: MessageBarType.error }, "An error occured.");
    }
    return (React.createElement("div", null,
        React.createElement(CustomerList, { customers: data.customers, selection: selection, height: 300 }),
        React.createElement(CustomerDetails, { customer: selected })));
};
var templateObject_1;
//# sourceMappingURL=index.js.map