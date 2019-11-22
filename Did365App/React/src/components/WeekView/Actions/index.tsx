
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export const Actions = ({ onConfirmWeek }) => {
    return (
        <div>
            <DefaultButton
                text="Confirm week"
                iconProps={{ iconName: 'DocumentApproval' }}
                onClick={onConfirmWeek} />
            <DefaultButton
                styles={{ root: { marginRight: 4 } }}
                text="Unconfirm week"
                iconProps={{ iconName: 'Cancel' }}
                disabled={true} />
        </div>
    );
}