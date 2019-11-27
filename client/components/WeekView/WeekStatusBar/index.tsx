
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';

export const WeekStatusBar = ({ weekConfirmed, totalDuration, matchedDuration, confirmedHours }) => {
    return (
        <div>
            <div style={{ marginTop: 10 }} hidden={weekConfirmed}>
                <MessageBar messageBarType={MessageBarType.info} messageBarIconProps={{ iconName: 'ReminderTime' }}>
                    {getDurationDisplay(totalDuration)}
                </MessageBar>
            </div>
            <div style={{ marginTop: 10 }} hidden={totalDuration - matchedDuration === 0|| weekConfirmed}>
                <MessageBar messageBarType={MessageBarType.warning} messageBarIconProps={{ iconName: 'BufferTimeBoth' }}>
                    You've {getDurationDisplay(totalDuration - matchedDuration)} that are not matched.
                </MessageBar>
            </div>
            <div style={{ marginTop: 10 }} hidden={totalDuration - matchedDuration > 0 || weekConfirmed}>
                <MessageBar messageBarType={MessageBarType.success} messageBarIconProps={{ iconName: 'BufferTimeBoth' }}>
                    All your hours are matched. Are you ready to confirm the week?
                </MessageBar>
            </div>
            <div style={{ marginTop: 15 }} hidden={!weekConfirmed}>
                <MessageBar messageBarType={MessageBarType.success} messageBarIconProps={{ iconName: 'CheckMark' }}>
                    The week is confirmed with {getDurationDisplay(undefined, confirmedHours)}.
                 </MessageBar>
            </div>
        </div>
    );
}