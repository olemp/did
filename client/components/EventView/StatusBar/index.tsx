
import { UserMessage } from 'components/UserMessage';
import { getDurationDisplay } from 'helpers';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';

export const StatusBar = ({ isConfirmed, data }) => {
    return (
        <div>
            <UserMessage
                hidden={isConfirmed}
                text={getDurationDisplay(data.totalDuration)}
                marginTop={10}
                iconName='ReminderTime' />
            <UserMessage
                hidden={data.totalDuration - data.matchedDuration === 0 || isConfirmed}
                text={`You've **${getDurationDisplay(data.totalDuration - data.matchedDuration)}** that are not matched.`}
                type={MessageBarType.warning}
                marginTop={10}
                iconName='BufferTimeBoth' />
            <UserMessage
                hidden={data.totalDuration - data.matchedDuration > 0 || isConfirmed}
                text='All your hours are matched. Are you ready to confirm the week?'
                type={MessageBarType.success}
                marginTop={10}
                iconName='BufferTimeBoth' />
            <UserMessage
                hidden={!isConfirmed}
                text={`The week is confirmed with ${getDurationDisplay(data.matchedDuration)}. Click **Unconfirm week** if you want to do some adjustments.`}
                type={MessageBarType.success}
                marginTop={10}
                iconName='CheckMark' />
        </div>
    );
}