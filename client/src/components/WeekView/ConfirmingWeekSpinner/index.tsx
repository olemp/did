
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';

export const ConfirmingWeekSpinner = ({ hidden }) => {
    return (
        <div hidden={hidden}>
            <Spinner label='Confirming the week....' />
        </div>
    );
}