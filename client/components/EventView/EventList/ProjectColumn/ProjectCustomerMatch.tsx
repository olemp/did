
import { UserMessage } from 'components/UserMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as format from 'string-format';

/**
 * @component ProjectCustomerMatch
 * @description @todo
 */
export const ProjectCustomerMatch = ({ customer, projectKey }) => {
    return (
        <UserMessage
            text={format('Event not matched. We found a matching customer `{0}`, but not a project with key `{1}`.', customer, projectKey)}
            type={MessageBarType.warning}
            iconName='ProductList' />
    );
}