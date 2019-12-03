
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
        if (event.suggestedProject) return <ProjectSuggestion event={event} onProjectAdded={onRefetch} />;
        else if (event.customer) return <ProjectCustomerMatch event={event} onProjectAdded={onRefetch} />;
        else if (event.customerKey) return <ProjectInvalidMatch matchedKey={event.customerKey + ' ' + event.projectKey} />;
        return <ProjectNoMatch onProjectSelected={onProjectSelected} />
    }
    return <a href={`/projects#${event.project.id}`}>{event.project.name}</a>;
}
