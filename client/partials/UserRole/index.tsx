import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

export const UserRole = ({ role }) => {
    /**
     * Get icon for role
     */
    const getIcon = () => ({ User: 'TemporaryUser', Admin: 'Admin', 'Invoice Manager': 'CustomList' }[role]);

    return (
        <>
            <Icon iconName={getIcon()} styles={{ root: { marginRight: 4 } }} />
            {role}
        </>
    );
};
