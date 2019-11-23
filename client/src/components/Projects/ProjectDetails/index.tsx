import * as React from 'react';
import { ProjectTimeEntries } from './ProjectTimeEntries';
import { IProjectDetailsProps } from './IProjectDetailsProps';

export const ProjectDetails = ({ project, entries }: IProjectDetailsProps) => (
    <div>
        <h2>{project.name}</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat placerat aliquam. Quisque porta elit id condimentum sagittis. Integer massa justo, imperdiet et nibh non, ultrices porta est. Quisque id ipsum metus. Nunc pretium imperdiet velit, ut ultricies arcu accumsan sit amet. Cras sit amet venenatis sapien. Quisque vehicula lacinia felis vestibulum efficitur. Mauris semper, urna auctor ullamcorper faucibus, mi est aliquam purus, ac sodales nisl purus quis nisi. Integer enim mauris, cursus sed tempus convallis, volutpat tempus urna. Praesent sagittis arcu non pulvinar venenatis. Mauris commodo, metus in placerat venenatis, risus augue bibendum risus, vitae venenatis purus nunc eget lorem. Quisque ut pharetra diam, at mattis mauris. Pellentesque sodales urna nisi, quis maximus sem cursus sollicitudin. Pellentesque massa ipsum, vulputate aliquam egestas a, dapibus quis nibh. Aenean tempus dui venenatis diam facilisis tempor. Etiam iaculis nulla vitae diam sollicitudin, ac consequat mauris porttitor.
        </p>
        <ProjectTimeEntries entries={entries} />
    </div>
);