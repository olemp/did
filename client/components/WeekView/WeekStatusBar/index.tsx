
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from 'helpers';
import { UserMessage } from 'components/UserMessage';

export const WeekStatusBar = ({ totalDuration, matchedDuration, confirmedHours }) => {
    const weekConfirmed = confirmedHours > 0;
    return (
        <div>
            <UserMessage
                hidden={weekConfirmed}
                text={getDurationDisplay(totalDuration)}
                marginTop={10}
                iconName='ReminderTime' />
            <UserMessage
                hidden={totalDuration - matchedDuration === 0 || weekConfirmed}
                text={`You've *${getDurationDisplay(totalDuration - matchedDuration)}* that are not matched.`}
                type={MessageBarType.warning}
                marginTop={10}
                iconName='BufferTimeBoth' />
            <UserMessage
                hidden={totalDuration - matchedDuration > 0 || weekConfirmed}
                text='All your hours are matched. Are you ready to confirm the week?'
                type={MessageBarType.success}
                marginTop={10}
                iconName='BufferTimeBoth' />
            <UserMessage
                hidden={!weekConfirmed}
                text={`The week is confirmed with ${getDurationDisplay(undefined, confirmedHours)}. Click **Unconfirm week** if you want to do some adjustments.`}
                type={MessageBarType.success}
                marginTop={10}
                iconName='CheckMark' />
        </div>
    );
}