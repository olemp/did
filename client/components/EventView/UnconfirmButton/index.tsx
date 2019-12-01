import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export const UnconfirmButton = ({ onClick, disabled }) => {
    return (
        <DefaultButton
            style={{ marginLeft: 8 }}
            text='Unconfirm period'
            iconProps={{ iconName: 'ErrorBadge' }}
            onClick={onClick}
            disabled={disabled} />
    );
}