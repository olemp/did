
import { UserMessage } from 'components/UserMessage';
import { ICalEvent } from 'models';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as format from 'string-format';

export interface IProjectCustomerMatchProps {
    event: ICalEvent;
}

/**
 * @component ProjectCustomerMatch
 * @description @todo
 */
export const ProjectCustomerMatch = ({ event }: IProjectCustomerMatchProps) => {
    return (
        <UserMessage
            text={format('Event not matched. We found a matching customer `{0}`, but not a project with key `{1}`.', event.customer.name, event.projectKey)}
            type={MessageBarType.warning}
            iconName='ProductList' />
    );
}