
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';

export const WeekStatusBar = ({ totalDuration, matchedDuration }) => {
    return (
        <div>
            <div style={{ marginTop: 10 }}>
                <MessageBar messageBarType={MessageBarType.info} messageBarIconProps={{ iconName: 'ReminderTime' }}>
                    {getDurationDisplay(totalDuration)}
                </MessageBar>
            </div>
            <div style={{ marginTop: 10 }}>
                <MessageBar messageBarType={MessageBarType.warning} messageBarIconProps={{ iconName: 'BufferTimeBoth' }}>
                    You've {getDurationDisplay(totalDuration - matchedDuration)} that are not matched.
                </MessageBar>
            </div>
        </div>
    );
}