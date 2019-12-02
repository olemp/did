
import { useMutation } from '@apollo/react-hooks';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { useState } from 'react';
import UPDATE_WEEK from './UPDATE_WEEK';

export const WeekStatusColumn = ({ weekNumber, closed }) => {
    const [updateWeek] = useMutation(UPDATE_WEEK);
    const [isClosed, setIsClosed] = useState<boolean>(closed);

    const onUpdateWeek = () => updateWeek({ variables: { weekNumber, closed: !isClosed } }).then(({ data: { closed } }) => setIsClosed(closed));

    return (
        <span title={isClosed ? 'The week is closed by an administrator. Click to open it.' : 'The week is open for everyone. Click to close it.'}>
            <a href='#' onClick={onUpdateWeek}>
                <Icon iconName={isClosed ? 'LockSolid' : 'OpenFile'} />
            </a>
        </span>
    );
}
