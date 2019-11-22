
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';

export const WeekStatusBar = ({ totalDuration }) => {
    return (
        <div>
            <MessageBar messageBarType={MessageBarType.info} messageBarIconProps={{ iconName: 'ReminderTime' }}>
                {getDurationDisplay(totalDuration)}
            </MessageBar>
        </div>
    );
}