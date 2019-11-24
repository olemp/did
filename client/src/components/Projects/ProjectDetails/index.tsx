import * as React from 'react';
import { ProjectTimeEntries } from './ProjectTimeEntries';
import { IProjectDetailsProps } from './IProjectDetailsProps';

export const ProjectDetails = ({ project, entries }: IProjectDetailsProps) => (
    <div style={{ marginTop: 20 }}>
        <h2>{project.name}</h2>
        <ProjectTimeEntries entries={entries} />
    </div>
);