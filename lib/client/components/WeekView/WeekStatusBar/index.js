import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';
export var WeekStatusBar = function (_a) {
    var weekConfirmed = _a.weekConfirmed, totalDuration = _a.totalDuration, matchedDuration = _a.matchedDuration, confirmedHours = _a.confirmedHours;
    return (React.createElement("div", null,
        React.createElement("div", { style: { marginTop: 10 }, hidden: weekConfirmed },
            React.createElement(MessageBar, { messageBarType: MessageBarType.info, messageBarIconProps: { iconName: 'ReminderTime' } }, getDurationDisplay(totalDuration))),
        React.createElement("div", { style: { marginTop: 10 }, hidden: totalDuration - matchedDuration === 0 || weekConfirmed },
            React.createElement(MessageBar, { messageBarType: MessageBarType.warning, messageBarIconProps: { iconName: 'BufferTimeBoth' } },
                "You've ",
                getDurationDisplay(totalDuration - matchedDuration),
                " that are not matched.")),
        React.createElement("div", { style: { marginTop: 10 }, hidden: totalDuration - matchedDuration > 0 || weekConfirmed },
            React.createElement(MessageBar, { messageBarType: MessageBarType.success, messageBarIconProps: { iconName: 'BufferTimeBoth' } }, "All your hours are matched. Are you ready to confirm the week?")),
        React.createElement("div", { style: { marginTop: 15 }, hidden: !weekConfirmed },
            React.createElement(MessageBar, { messageBarType: MessageBarType.success, messageBarIconProps: { iconName: 'CheckMark' } },
                "The week is confirmed with ",
                getDurationDisplay(undefined, confirmedHours),
                "."))));
};
//# sourceMappingURL=index.js.map