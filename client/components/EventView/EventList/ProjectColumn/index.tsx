
import * as React from 'react';
import { IProjectColumnProps } from './IProjectColumnProps';
import { ProjectCustomerMatch } from './ProjectCustomerMatch';
import { ProjectInvalidMatch } from './ProjectInvalidMatch';
import { ProjectNoMatch } from './ProjectNoMatch';
import { ProjectSuggestion } from './ProjectSuggestion';

/**
 * @component ProjectColumn
 * @description @todo
 */
export const ProjectColumn = ({ event, isConfirmed, onRefetch, onProjectSelected }: IProjectColumnProps) => {
    if (!event.project) {
        if (isConfirmed) return null;
        if (!event.isOrganizer) return <ProjectNoMatch isOrganizer={false} onProjectSelected={onProjectSelected} />
        if (event.suggestedProject) return <ProjectSuggestion matchedKey={event.customerKey + ' ' + event.projectKey} suggestedProject={event.suggestedProject} onRefetch={onRefetch} />;
        else if (event.customer) return <ProjectCustomerMatch customer={event.customer.name} projectKey={event.projectKey} />;
        else if (event.customerKey) return <ProjectInvalidMatch matchedKey={event.customerKey + ' ' + event.projectKey} />;
        return <ProjectNoMatch onProjectSelected={onProjectSelected} />
    }
    return <a href={`/projects#${event.project.key}`}>{event.project.name}</a>;
}
