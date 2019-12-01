
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export const ConfirmButton = ({ onClick, disabled }) => {
    return (
        <PrimaryButton
            text='Confirm period'
            iconProps={{ iconName: 'CheckMark' }}
            onClick={onClick}
            disabled={disabled} />
    );
}