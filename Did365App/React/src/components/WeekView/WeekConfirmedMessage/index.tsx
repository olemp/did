
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';

export const WeekConfirmedMessage = ({ hidden, totalDuration }) => {
    return (
        <div hidden={hidden}>
            <MessageBar messageBarType={MessageBarType.success} messageBarIconProps={{ iconName: 'CheckMark' }}>
                The week is confirmed with {getDurationDisplay(totalDuration)}.
            </MessageBar>
        </div>
    );
}