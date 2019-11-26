
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export const Actions = ({ onConfirmWeek, onUnconfirmWeek, onConfirmWeekEnabled, onUnconfirmWeekEnabled }) => {
    return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
            <PrimaryButton
                text="Confirm week"
                iconProps={{ iconName: 'CheckMark' }}
                onClick={onConfirmWeek}
                disabled={!onConfirmWeekEnabled} />
            <DefaultButton
                style={{ marginLeft: 8 }}
                text="Unconfirm week"
                iconProps={{ iconName: 'ErrorBadge' }}
                onClick={onUnconfirmWeek}
                disabled={!onUnconfirmWeekEnabled} />
        </div>
    );
}