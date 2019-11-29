import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export const UnconfirmWeekButton = ({ onClick, disabled }) => {
    return (
        <DefaultButton
            style={{ marginLeft: 8 }}
            text='Unconfirm week'
            iconProps={{ iconName: 'ErrorBadge' }}
            onClick={onClick}
            disabled={disabled} />
    );
}