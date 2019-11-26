
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { getDurationDisplay } from '../../../helpers';

export const WeekConfirmedMessage = ({ hidden, confirmedHours }) => {
    return (
        <div hidden={hidden} style={{ marginTop: 15 }}>
            <MessageBar messageBarType={MessageBarType.success} messageBarIconProps={{ iconName: 'CheckMark' }}>
                The week is confirmed with {getDurationDisplay(undefined, confirmedHours)}.
            </MessageBar>
        </div>
    );
}