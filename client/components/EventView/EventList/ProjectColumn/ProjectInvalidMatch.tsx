
import { UserMessage } from 'components/UserMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as format from 'string-format';

/**
 * @component ProjectInvalidMatch
 * @description @todo
 */
export const ProjectInvalidMatch = ({ matchedKey }) => {
    return (
        <UserMessage
            style={{ marginTop: 5 }}
            text={format('Event not matched. Found no match for `{0}`.', matchedKey)}
            type={MessageBarType.warning}
            iconName='SearchAndApps' />
    );
}