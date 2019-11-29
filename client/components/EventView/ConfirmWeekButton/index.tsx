
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export const ConfirmWeekButton = ({ onClick, disabled }) => {
    return (
        <PrimaryButton
            text='Confirm week'
            iconProps={{ iconName: 'CheckMark' }}
            onClick={onClick}
            disabled={disabled} />
    );
}