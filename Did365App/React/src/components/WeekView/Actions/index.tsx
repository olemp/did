
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export const Actions = ({ onConfirmWeek }) => {
    return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
            <DefaultButton
                text="Confirm week"
                iconProps={{ iconName: 'DocumentApproval' }}
                onClick={onConfirmWeek} />
            <DefaultButton
                style={{ marginLeft: 8 }}
                text="Unconfirm week"
                iconProps={{ iconName: 'Cancel' }}
                disabled={true} />
        </div>
    );
}