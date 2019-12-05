
import { UserMessage } from 'components/UserMessage';
import { getDurationDisplay } from 'helpers';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import * as React from 'react';
import { IStatusBarProps } from './IStatusBarProps';

export const StatusBar = ({ loading, isConfirmed, events }: IStatusBarProps) => {
    let totalDuration = events.reduce((sum, event) => sum += event.durationMinutes, 0);
    let matchedDuration = events.filter(event => !!event.project).reduce((sum, event) => sum += event.durationMinutes, 0);

    return (
        <div className='c-eventview-statusbar' style={{ marginTop: 10 }}>
            <Shimmer isDataLoaded={!loading} />
            <Shimmer isDataLoaded={!loading} />
            {!loading && (
                <>
                    <UserMessage
                        hidden={isConfirmed}
                        text={getDurationDisplay(totalDuration)}
                        marginTop={0}
                        iconName='ReminderTime' />
                    <UserMessage
                        hidden={totalDuration - matchedDuration === 0 || isConfirmed}
                        text={`You've **${getDurationDisplay(totalDuration - matchedDuration)}** that are not matched.`}
                        type={MessageBarType.warning}
                        marginTop={10}
                        iconName='BufferTimeBoth' />
                    <UserMessage
                        hidden={totalDuration - matchedDuration > 0 || isConfirmed}
                        text='All your hours are matched. Are you ready to confirm the week?'
                        type={MessageBarType.success}
                        marginTop={10}
                        iconName='BufferTimeBoth' />
                    <UserMessage
                        hidden={!isConfirmed}
                        text={`The week is confirmed with ${getDurationDisplay(matchedDuration)}. Click **Unconfirm period** if you want to do some adjustments.`}
                        type={MessageBarType.success}
                        marginTop={10}
                        iconName='CheckMark' />
                </>
            )}
        </div>
    );
}