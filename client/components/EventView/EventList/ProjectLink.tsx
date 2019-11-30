
import { UserMessage } from 'components/UserMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';

export const ProjectLink = ({ item }) => {
    if (!item.project) {
        let matchedKey = item.customerKey + ' ' + item.projectKey;
        if (item.suggestedProject) return <UserMessage text={`Event not matched correctly. We found \`${matchedKey}\`, but that project does not exist. Did you mean<a href="/projects#${item.suggestedProject.key}">\`${item.suggestedProject.key}\`</a>?`} type={MessageBarType.warning} iconName='Lightbulb' />
        else if (item.customer) return <UserMessage text={`Event not matched. We found a matching customer \`${item.customer.name}\`, but not a project with key \`${item.projectKey}\`.`} type={MessageBarType.warning} iconName='ProductList' />;
        else if (item.customerKey) return <UserMessage text={`Event not matched. Found no match for \`${matchedKey}\`.`} type={MessageBarType.warning} iconName='SearchAndApps' />;
        else return <UserMessage text='Event not matched. Did you add a project key to the `subject`, `body` or `category`?' type={MessageBarType.severeWarning} iconName='SearchIssue' />
    }
    return <a href={`/projects#${item.project.key}`}>{item.project.name}</a>;
}
