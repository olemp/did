var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import * as React from 'react';
import { weekNumber as currentWeekNumber } from 'weeknumber';
import { Actions } from './Actions';
import { EventList } from './EventList';
import { WeekStatusBar } from './WeekStatusBar';
export var GET_WEEK_VIEW = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query($weekNumber: Int!) {\n        confirmedHours(weekNumber: $weekNumber) \n        weekView(weekNumber: $weekNumber) {\n            events {\n                id,\n                title,\n                webLink,\n                durationMinutes,\n                startTime,\n                endTime,\n                project {\n                    key,\n                    name\n                }\n            },\n            totalDuration,\n            matchedDuration,\n        }\n    }\n"], ["\n    query($weekNumber: Int!) {\n        confirmedHours(weekNumber: $weekNumber) \n        weekView(weekNumber: $weekNumber) {\n            events {\n                id,\n                title,\n                webLink,\n                durationMinutes,\n                startTime,\n                endTime,\n                project {\n                    key,\n                    name\n                }\n            },\n            totalDuration,\n            matchedDuration,\n        }\n    }\n"])));
export var WeekView2 = function (_a) {
    var weeksToShow = _a.weeksToShow;
    var initialWeekNumber = document.location.hash ? parseInt(document.location.hash.substring(1)) : currentWeekNumber();
    var _b = [
        React.useState(initialWeekNumber),
        React.useState(undefined),
    ], _c = _b[0], weekNumber = _c[0], setWeekNumber = _c[1], _d = _b[1], confirmedHours = _d[0], setConfirmedHours = _d[1];
    var _e = useQuery(GET_WEEK_VIEW, { variables: { weekNumber: weekNumber } }), loading = _e.loading, error = _e.error, data = _e.data;
    confirmedHours = confirmedHours != undefined ? confirmedHours : (data && data.confirmedHours);
    var weekConfirmed = confirmedHours > 0;
    var onChangeWeek = function (wn) {
        document.location.hash = "" + wn;
        setWeekNumber(wn);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Actions, { weekView: data && data.weekView, weekNumber: weekNumber, onConfirmWeekEnabled: !weekConfirmed && !loading, onUnconfirmWeekEnabled: weekConfirmed && !loading, onSetConfirmedHours: setConfirmedHours }),
        React.createElement(Pivot, { styles: { root: { display: 'flex', flexWrap: 'wrap' } }, defaultSelectedKey: "" + weekNumber, onLinkClick: function (item) { return onChangeWeek(parseInt(item.props.itemKey)); } }, Array.from(Array(weeksToShow).keys()).map(function (i) {
            var wn = currentWeekNumber() - (weeksToShow - 1) + i;
            var isCurrentWeek = wn === weekNumber;
            return (React.createElement(PivotItem, { key: i, itemKey: "" + wn, headerText: "Week " + wn }, isCurrentWeek && (React.createElement("div", { style: { marginTop: 10 } },
                loading && React.createElement(Shimmer, null),
                error && React.createElement(MessageBar, { messageBarType: MessageBarType.error }, "An error occured."),
                data && !loading && (React.createElement(WeekStatusBar, { weekConfirmed: weekConfirmed, totalDuration: data.weekView.totalDuration, matchedDuration: data.weekView.matchedDuration, confirmedHours: confirmedHours })),
                React.createElement(EventList, { hidden: weekConfirmed, enableShimmer: loading, events: data ? data.weekView.events : [] })))));
        }))));
};
var templateObject_1;
//# sourceMappingURL=index.js.map