
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
                <div className="container">
                    <div className="row">
                        <div className="col-sm"
                            hidden={isConfirmed}>
                            <UserMessage text={getDurationDisplay(totalDuration)} iconName='ReminderTime' />
                        </div>
                        <div className="col-sm" hidden={totalDuration - matchedDuration === 0 || isConfirmed}>
                            <UserMessage
                                text={`You've **${getDurationDisplay(totalDuration - matchedDuration)}** that are not matched.`}
                                type={MessageBarType.warning}
                                iconName='BufferTimeBoth' />
                        </div>
                        <div className="col-sm" hidden={totalDuration - matchedDuration > 0 || isConfirmed}>
                            <UserMessage
                                text='All your hours are matched. Are you ready to confirm the week?'
                                type={MessageBarType.success}
                                iconName='BufferTimeBoth' />
                        </div>
                        <div className="col-sm" hidden={!isConfirmed}>
                            <UserMessage
                                text={`The week is confirmed with ${getDurationDisplay(matchedDuration)}. Click **Unconfirm week** if you want to do some adjustments.`}
                                type={MessageBarType.success}
                                iconName='CheckMark' />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}